package com.neuronest.ai;

import com.neuronest.ai.dto.*;
import com.neuronest.ai.entity.AiInteractionMetadata;
import com.neuronest.ai.repository.AiInteractionMetadataRepository;
import com.neuronest.ai.service.AiService;
import com.neuronest.ai.service.GeminiApiClient;
import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class AiServiceTest {

    private FakeMetadataRepository metadataRepository;
    private FakeUserRepository userRepository;
    private FakeGeminiClient geminiClient;
    private AiService aiService;
    private User testUser;

    @BeforeEach
    void setUp() {
        metadataRepository = new FakeMetadataRepository();
        userRepository = new FakeUserRepository();
        geminiClient = new FakeGeminiClient();

        aiService = new AiService(geminiClient, metadataRepository, userRepository);

        testUser = new User("aiuser@neuronest.dev", "hashed_pwd", "Taylor", false);
        testUser.setId(UUID.randomUUID());
        testUser.getRoles().add(new Role(RoleName.ROLE_USER, "Standard user"));
        userRepository.save(testUser);
    }

    @Test
    @DisplayName("Simplifies complex text into accessible bullet points with deterministic fallback")
    void testSimplifyTextFallback() {
        SimplifyTextRequest req = new SimplifyTextRequest();
        req.setText("Photosynthesis is a chemical process where chlorophyll pigments absorb light photons to convert water and carbon dioxide into glucose.");

        SimplifyTextResponse res = aiService.simplifyText(testUser.getId(), req);

        assertNotNull(res);
        assertNotNull(res.getSimplifiedText());
        assertFalse(res.getKeyPoints().isEmpty());
        assertTrue(res.isFallbackUsed());
    }

    @Test
    @DisplayName("Breaks down big tasks into friendly 3-4 micro-steps")
    void testBreakdownTask() {
        TaskBreakdownRequest req = new TaskBreakdownRequest();
        req.setTaskTitle("Clean my messy bedroom floor");

        TaskBreakdownResponse res = aiService.breakdownTask(testUser.getId(), req);

        assertNotNull(res);
        assertEquals("Clean my messy bedroom floor", res.getTaskTitle());
        assertEquals(4, res.getSteps().size());
        assertTrue(res.getSteps().stream().anyMatch(s -> s.getTitle().contains("floor")));
    }

    @Test
    @DisplayName("Recommends soothing untimed games when user needs calm")
    void testRecommendGamesForCalm() {
        GameRecommendationRequest req = new GameRecommendationRequest();
        req.setCurrentMood("NEED_CALM");

        GameRecommendationResponse res = aiService.recommendGames(testUser.getId(), req);

        assertNotNull(res);
        assertFalse(res.getRecommendations().isEmpty());
        assertTrue(res.getRecommendations().stream().anyMatch(g -> g.getGameId().equals("memory-garden")));
    }

    // Fakes
    static class FakeGeminiClient extends GeminiApiClient {
        public FakeGeminiClient() {
            super(new com.neuronest.ai.config.AiProperties(), new com.fasterxml.jackson.databind.ObjectMapper());
        }

        @Override
        public Optional<String> generateText(String systemInstruction, String userPrompt) {
            // Emulate offline fallback testing
            return Optional.empty();
        }
    }

    static class FakeMetadataRepository implements AiInteractionMetadataRepository {
        private final List<AiInteractionMetadata> list = new ArrayList<>();
        @Override public List<AiInteractionMetadata> findByUserIdOrderByCreatedAtDesc(UUID userId) {
            return list.stream().filter(m -> m.getUser().getId().equals(userId)).toList();
        }
        @Override public long countByUserId(UUID userId) {
            return list.stream().filter(m -> m.getUser().getId().equals(userId)).count();
        }
        @Override public <S extends AiInteractionMetadata> S save(S entity) {
            list.add(entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends AiInteractionMetadata> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends AiInteractionMetadata> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<AiInteractionMetadata> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public AiInteractionMetadata getOne(UUID uuid) { return null; }
        @Override public AiInteractionMetadata getById(UUID uuid) { return null; }
        @Override public AiInteractionMetadata getReferenceById(UUID uuid) { return null; }
        @Override public <S extends AiInteractionMetadata> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends AiInteractionMetadata> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends AiInteractionMetadata> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends AiInteractionMetadata> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends AiInteractionMetadata> long count(Example<S> example) { return 0; }
        @Override public <S extends AiInteractionMetadata> boolean exists(Example<S> example) { return false; }
        @Override public <S extends AiInteractionMetadata, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends AiInteractionMetadata> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<AiInteractionMetadata> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<AiInteractionMetadata> findAll() { return list; }
        @Override public List<AiInteractionMetadata> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(AiInteractionMetadata entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends AiInteractionMetadata> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<AiInteractionMetadata> findAll(Sort sort) { return null; }
        @Override public Page<AiInteractionMetadata> findAll(Pageable pageable) { return null; }
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
}
