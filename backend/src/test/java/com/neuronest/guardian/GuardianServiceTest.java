package com.neuronest.guardian;

import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.games.repository.GameSessionRepository;
import com.neuronest.guardian.dto.*;
import com.neuronest.guardian.entity.ConsentRecord;
import com.neuronest.guardian.entity.GuardianRelationship;
import com.neuronest.guardian.repository.ConsentRecordRepository;
import com.neuronest.guardian.repository.GuardianRelationshipRepository;
import com.neuronest.guardian.service.GuardianService;
import com.neuronest.personalization.repository.UserProfileRepository;
import com.neuronest.routines.repository.RoutineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class GuardianServiceTest {

    private FakeRelationshipRepository relationshipRepository;
    private FakeConsentRepository consentRepository;
    private FakeUserRepository userRepository;
    private FakeProfileRepository profileRepository;
    private FakePreferencesRepository preferencesRepository;
    private FakeGameSessionRepository sessionRepository;
    private FakeRoutineRepository routineRepository;

    private GuardianService guardianService;
    private User guardianUser;
    private User childUser;

    @BeforeEach
    void setUp() {
        relationshipRepository = new FakeRelationshipRepository();
        consentRepository = new FakeConsentRepository();
        userRepository = new FakeUserRepository();
        profileRepository = new FakeProfileRepository();
        preferencesRepository = new FakePreferencesRepository();
        sessionRepository = new FakeGameSessionRepository();
        routineRepository = new FakeRoutineRepository();

        guardianService = new GuardianService(
                relationshipRepository,
                consentRepository,
                userRepository,
                profileRepository,
                preferencesRepository,
                sessionRepository,
                routineRepository
        );

        guardianUser = new User("parent@neuronest.dev", "hashed_pwd", "Sarah Parent", false);
        guardianUser.setId(UUID.randomUUID());
        guardianUser.getRoles().add(new Role(RoleName.ROLE_PARENT_OR_GUARDIAN, "Parent guardian"));
        userRepository.save(guardianUser);

        childUser = new User("leo@neuronest.dev", "hashed_pwd", "Leo", true);
        childUser.setId(UUID.randomUUID());
        childUser.getRoles().add(new Role(RoleName.ROLE_USER, "Minor child user"));
        userRepository.save(childUser);
    }

    @Test
    @DisplayName("Successfully links dependent minor child and initializes consent records")
    void testLinkDependentChild() {
        LinkDependentRequest req = new LinkDependentRequest();
        req.setDependentEmail("leo@neuronest.dev");
        req.setRelationshipType("PARENT");

        GuardianRelationshipDto linked = guardianService.linkDependent(guardianUser.getId(), req);

        assertNotNull(linked);
        assertEquals(childUser.getId(), linked.getDependentId());
        assertEquals("Leo", linked.getDependentName());
        assertEquals("APPROVED", linked.getStatus());

        List<ConsentRecordDto> consents = guardianService.getConsentRecords(childUser.getId());
        assertFalse(consents.isEmpty());
        assertTrue(consents.stream().anyMatch(c -> c.getConsentType().equals("MINOR_ACCOUNT_CREATION")));
    }

    @Test
    @DisplayName("Updates consent permission accurately")
    void testUpdateConsent() {
        // First establish relationship
        LinkDependentRequest linkReq = new LinkDependentRequest();
        linkReq.setDependentEmail("leo@neuronest.dev");
        guardianService.linkDependent(guardianUser.getId(), linkReq);

        UpdateConsentRequest updateReq = new UpdateConsentRequest();
        updateReq.setConsentType("AI_ASSISTANCE");
        updateReq.setGranted(false);
        updateReq.setNotes("Temporarily paused AI guide");

        ConsentRecordDto updated = guardianService.updateConsent(guardianUser.getId(), childUser.getId(), updateReq);
        assertNotNull(updated);
        assertEquals("AI_ASSISTANCE", updated.getConsentType());
        assertFalse(updated.isGranted());
    }

    @Test
    @DisplayName("Returns positive activity summary while preserving child privacy")
    void testGetDependentSummary() {
        LinkDependentRequest linkReq = new LinkDependentRequest();
        linkReq.setDependentEmail("leo@neuronest.dev");
        guardianService.linkDependent(guardianUser.getId(), linkReq);

        DependentSummaryDto summary = guardianService.getDependentSummary(guardianUser.getId(), childUser.getId());
        assertNotNull(summary);
        assertEquals("Leo", summary.getDisplayName());
        assertNotNull(summary.getPrivacyNotice());
        assertTrue(summary.getPrivacyNotice().contains("Child Privacy Guarantee"));
    }

    // Fakes
    static class FakeRelationshipRepository implements GuardianRelationshipRepository {
        private final List<GuardianRelationship> list = new ArrayList<>();
        @Override public List<GuardianRelationship> findByGuardianId(UUID id) {
            return list.stream().filter(r -> r.getGuardian().getId().equals(id)).toList();
        }
        @Override public List<GuardianRelationship> findByDependentId(UUID id) {
            return list.stream().filter(r -> r.getDependent().getId().equals(id)).toList();
        }
        @Override public Optional<GuardianRelationship> findByGuardianIdAndDependentId(UUID gId, UUID dId) {
            return list.stream().filter(r -> r.getGuardian().getId().equals(gId) && r.getDependent().getId().equals(dId)).findFirst();
        }
        @Override public boolean existsByGuardianIdAndDependentId(UUID gId, UUID dId) {
            return list.stream().anyMatch(r -> r.getGuardian().getId().equals(gId) && r.getDependent().getId().equals(dId));
        }
        @Override public <S extends GuardianRelationship> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            list.add(entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends GuardianRelationship> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends GuardianRelationship> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<GuardianRelationship> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public GuardianRelationship getOne(UUID uuid) { return null; }
        @Override public GuardianRelationship getById(UUID uuid) { return null; }
        @Override public GuardianRelationship getReferenceById(UUID uuid) { return null; }
        @Override public <S extends GuardianRelationship> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends GuardianRelationship> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends GuardianRelationship> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends GuardianRelationship> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends GuardianRelationship> long count(Example<S> example) { return 0; }
        @Override public <S extends GuardianRelationship> boolean exists(Example<S> example) { return false; }
        @Override public <S extends GuardianRelationship, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends GuardianRelationship> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<GuardianRelationship> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<GuardianRelationship> findAll() { return list; }
        @Override public List<GuardianRelationship> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(GuardianRelationship entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends GuardianRelationship> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<GuardianRelationship> findAll(Sort sort) { return null; }
        @Override public Page<GuardianRelationship> findAll(Pageable pageable) { return null; }
    }

    static class FakeConsentRepository implements ConsentRecordRepository {
        private final List<ConsentRecord> list = new ArrayList<>();
        @Override public List<ConsentRecord> findByUserId(UUID userId) {
            return list.stream().filter(c -> c.getUser().getId().equals(userId)).toList();
        }
        @Override public Optional<ConsentRecord> findByUserIdAndConsentType(UUID userId, String type) {
            return list.stream().filter(c -> c.getUser().getId().equals(userId) && c.getConsentType().equalsIgnoreCase(type)).findFirst();
        }
        @Override public <S extends ConsentRecord> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            list.removeIf(c -> c.getId().equals(entity.getId()));
            list.add(entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends ConsentRecord> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends ConsentRecord> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<ConsentRecord> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public ConsentRecord getOne(UUID uuid) { return null; }
        @Override public ConsentRecord getById(UUID uuid) { return null; }
        @Override public ConsentRecord getReferenceById(UUID uuid) { return null; }
        @Override public <S extends ConsentRecord> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends ConsentRecord> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends ConsentRecord> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends ConsentRecord> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends ConsentRecord> long count(Example<S> example) { return 0; }
        @Override public <S extends ConsentRecord> boolean exists(Example<S> example) { return false; }
        @Override public <S extends ConsentRecord, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends ConsentRecord> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<ConsentRecord> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<ConsentRecord> findAll() { return list; }
        @Override public List<ConsentRecord> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(ConsentRecord entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends ConsentRecord> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<ConsentRecord> findAll(Sort sort) { return null; }
        @Override public Page<ConsentRecord> findAll(Pageable pageable) { return null; }
    }

    static class FakeUserRepository implements UserRepository {
        private final Map<UUID, User> store = new HashMap<>();
        @Override public Optional<User> findById(UUID id) { return Optional.ofNullable(store.get(id)); }
        @Override public Optional<User> findByEmail(String email) {
            return store.values().stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
        }
        @Override public boolean existsByEmail(String email) {
            return store.values().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(email));
        }
        @Override public <S extends User> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public <S extends User> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public List<User> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<User> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void delete(User entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends User> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public void flush() {}
        @Override public <S extends User> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends User> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<User> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public User getOne(UUID uuid) { return store.get(uuid); }
        @Override public User getById(UUID uuid) { return store.get(uuid); }
        @Override public User getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends User> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends User> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends User> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends User> long count(Example<S> example) { return 0; }
        @Override public <S extends User> boolean exists(Example<S> example) { return false; }
        @Override public <S extends User, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public List<User> findAll(Sort sort) { return null; }
        @Override public Page<User> findAll(Pageable pageable) { return null; }
    }

    static class FakeProfileRepository implements UserProfileRepository {
        @Override public Optional<com.neuronest.personalization.entity.UserProfile> findById(UUID uuid) { return Optional.empty(); }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> S save(S entity) { return entity; }
        @Override public void flush() {}
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> S saveAndFlush(S entity) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<com.neuronest.personalization.entity.UserProfile> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public com.neuronest.personalization.entity.UserProfile getOne(UUID uuid) { return null; }
        @Override public com.neuronest.personalization.entity.UserProfile getById(UUID uuid) { return null; }
        @Override public com.neuronest.personalization.entity.UserProfile getReferenceById(UUID uuid) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> long count(Example<S> example) { return 0; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> boolean exists(Example<S> example) { return false; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserProfile> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<com.neuronest.personalization.entity.UserProfile> findAll() { return Collections.emptyList(); }
        @Override public List<com.neuronest.personalization.entity.UserProfile> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return 0; }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(com.neuronest.personalization.entity.UserProfile entity) {}
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends com.neuronest.personalization.entity.UserProfile> entities) {}
        @Override public void deleteAll() {}
        @Override public List<com.neuronest.personalization.entity.UserProfile> findAll(Sort sort) { return null; }
        @Override public Page<com.neuronest.personalization.entity.UserProfile> findAll(Pageable pageable) { return null; }
    }

    static class FakeGameSessionRepository implements GameSessionRepository {
        @Override public long countByUserIdAndStatus(UUID userId, String status) { return 4; }
        @Override public List<com.neuronest.games.entity.GameSession> findByUserIdOrderByStartedAtDesc(UUID userId) { return Collections.emptyList(); }
        @Override public Page<com.neuronest.games.entity.GameSession> findByUserIdOrderByStartedAtDesc(UUID userId, Pageable pageable) { return Page.empty(); }
        @Override public void flush() {}
        @Override public <S extends com.neuronest.games.entity.GameSession> S saveAndFlush(S entity) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<com.neuronest.games.entity.GameSession> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public com.neuronest.games.entity.GameSession getOne(UUID uuid) { return null; }
        @Override public com.neuronest.games.entity.GameSession getById(UUID uuid) { return null; }
        @Override public com.neuronest.games.entity.GameSession getReferenceById(UUID uuid) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends com.neuronest.games.entity.GameSession> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> long count(Example<S> example) { return 0; }
        @Override public <S extends com.neuronest.games.entity.GameSession> boolean exists(Example<S> example) { return false; }
        @Override public <S extends com.neuronest.games.entity.GameSession, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends com.neuronest.games.entity.GameSession> S save(S entity) { return entity; }
        @Override public <S extends com.neuronest.games.entity.GameSession> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<com.neuronest.games.entity.GameSession> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<com.neuronest.games.entity.GameSession> findAll() { return Collections.emptyList(); }
        @Override public List<com.neuronest.games.entity.GameSession> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return 0; }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(com.neuronest.games.entity.GameSession entity) {}
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends com.neuronest.games.entity.GameSession> entities) {}
        @Override public void deleteAll() {}
        @Override public List<com.neuronest.games.entity.GameSession> findAll(Sort sort) { return null; }
        @Override public Page<com.neuronest.games.entity.GameSession> findAll(Pageable pageable) { return null; }
    }

    static class FakeRoutineRepository implements RoutineRepository {
        @Override public List<com.neuronest.routines.entity.Routine> findByUserIdOrderByDisplayOrderAscCreatedAtAsc(UUID userId) { return Collections.emptyList(); }
        @Override public void flush() {}
        @Override public <S extends com.neuronest.routines.entity.Routine> S saveAndFlush(S entity) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<com.neuronest.routines.entity.Routine> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public com.neuronest.routines.entity.Routine getOne(UUID uuid) { return null; }
        @Override public com.neuronest.routines.entity.Routine getById(UUID uuid) { return null; }
        @Override public com.neuronest.routines.entity.Routine getReferenceById(UUID uuid) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends com.neuronest.routines.entity.Routine> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> long count(Example<S> example) { return 0; }
        @Override public <S extends com.neuronest.routines.entity.Routine> boolean exists(Example<S> example) { return false; }
        @Override public <S extends com.neuronest.routines.entity.Routine, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends com.neuronest.routines.entity.Routine> S save(S entity) { return entity; }
        @Override public <S extends com.neuronest.routines.entity.Routine> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<com.neuronest.routines.entity.Routine> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<com.neuronest.routines.entity.Routine> findAll() { return Collections.emptyList(); }
        @Override public List<com.neuronest.routines.entity.Routine> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return 0; }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(com.neuronest.routines.entity.Routine entity) {}
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends com.neuronest.routines.entity.Routine> entities) {}
        @Override public void deleteAll() {}
        @Override public List<com.neuronest.routines.entity.Routine> findAll(Sort sort) { return null; }
        @Override public Page<com.neuronest.routines.entity.Routine> findAll(Pageable pageable) { return null; }
    }

    static class FakePreferencesRepository implements com.neuronest.personalization.repository.UserPreferencesRepository {
        @Override public Optional<com.neuronest.personalization.entity.UserPreferences> findById(UUID uuid) { return Optional.empty(); }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> S save(S entity) { return entity; }
        @Override public void flush() {}
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> S saveAndFlush(S entity) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<com.neuronest.personalization.entity.UserPreferences> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public com.neuronest.personalization.entity.UserPreferences getOne(UUID uuid) { return null; }
        @Override public com.neuronest.personalization.entity.UserPreferences getById(UUID uuid) { return null; }
        @Override public com.neuronest.personalization.entity.UserPreferences getReferenceById(UUID uuid) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> long count(Example<S> example) { return 0; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> boolean exists(Example<S> example) { return false; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends com.neuronest.personalization.entity.UserPreferences> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<com.neuronest.personalization.entity.UserPreferences> findAll() { return Collections.emptyList(); }
        @Override public List<com.neuronest.personalization.entity.UserPreferences> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return 0; }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(com.neuronest.personalization.entity.UserPreferences entity) {}
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends com.neuronest.personalization.entity.UserPreferences> entities) {}
        @Override public void deleteAll() {}
        @Override public List<com.neuronest.personalization.entity.UserPreferences> findAll(Sort sort) { return null; }
        @Override public Page<com.neuronest.personalization.entity.UserPreferences> findAll(Pageable pageable) { return null; }
    }
}
