package com.neuronest.routines;

import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.routines.dto.*;
import com.neuronest.routines.entity.*;
import com.neuronest.routines.repository.*;
import com.neuronest.routines.service.RoutineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class RoutineServiceTest {

    private FakeRoutineRepository routineRepository;
    private FakeRoutineStepRepository stepRepository;
    private FakeUserTaskRepository taskRepository;
    private FakeUserRepository userRepository;

    private RoutineService routineService;
    private User testUser;

    @BeforeEach
    void setUp() {
        routineRepository = new FakeRoutineRepository();
        stepRepository = new FakeRoutineStepRepository();
        taskRepository = new FakeUserTaskRepository();
        userRepository = new FakeUserRepository();

        routineService = new RoutineService(routineRepository, stepRepository, taskRepository, userRepository);

        testUser = new User("journey@neuronest.dev", "hashed_pwd", "Jordan", false);
        testUser.setId(UUID.randomUUID());
        testUser.getRoles().add(new Role(RoleName.ROLE_USER, "Standard user"));
        userRepository.save(testUser);
    }

    @Test
    @DisplayName("Seeds starter routines automatically on first access to avoid empty state")
    void testGetRoutinesAutoSeed() {
        List<RoutineDto> routines = routineService.getRoutines(testUser.getId());
        assertNotNull(routines);
        assertFalse(routines.isEmpty());
        assertTrue(routines.stream().anyMatch(r -> r.getTitle().contains("Morning")));
        assertTrue(routines.stream().anyMatch(r -> r.getTitle().contains("Evening")));
    }

    @Test
    @DisplayName("Creates and toggles tasks seamlessly")
    void testCreateAndToggleTask() {
        CreateTaskRequest req = new CreateTaskRequest();
        req.setTitle("Practice 5-minute deep breathing");
        req.setCategory("PERSONAL");
        req.setPriority("LOW");
        req.setDueDate(LocalDate.now());

        UserTaskDto created = routineService.createTask(testUser.getId(), req);
        assertNotNull(created);
        assertFalse(created.isCompleted());
        assertEquals("Practice 5-minute deep breathing", created.getTitle());

        UserTaskDto toggled = routineService.toggleTask(testUser.getId(), created.getId());
        assertTrue(toggled.isCompleted());
        assertNotNull(toggled.getCompletedAt());
    }

    // Fakes
    static class FakeRoutineRepository implements RoutineRepository {
        private final Map<UUID, Routine> store = new HashMap<>();
        @Override public List<Routine> findByUserIdOrderByDisplayOrderAscCreatedAtAsc(UUID userId) {
            return store.values().stream().filter(r -> r.getUser().getId().equals(userId)).toList();
        }
        @Override public Optional<Routine> findById(UUID uuid) { return Optional.ofNullable(store.get(uuid)); }
        @Override public <S extends Routine> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public void delete(Routine entity) { store.remove(entity.getId()); }
        @Override public void flush() {}
        @Override public <S extends Routine> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Routine> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<Routine> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public Routine getOne(UUID uuid) { return store.get(uuid); }
        @Override public Routine getById(UUID uuid) { return store.get(uuid); }
        @Override public Routine getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends Routine> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Routine> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends Routine> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends Routine> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends Routine> long count(Example<S> example) { return 0; }
        @Override public <S extends Routine> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Routine, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Routine> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public List<Routine> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<Routine> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends Routine> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<Routine> findAll(Sort sort) { return null; }
        @Override public Page<Routine> findAll(Pageable pageable) { return null; }
    }

    static class FakeRoutineStepRepository implements RoutineStepRepository {
        private final Map<UUID, RoutineStep> store = new HashMap<>();
        @Override public List<RoutineStep> findByRoutineIdOrderByStepOrderAsc(UUID routineId) {
            return store.values().stream().filter(s -> s.getRoutine().getId().equals(routineId)).toList();
        }
        @Override public Optional<RoutineStep> findById(UUID uuid) { return Optional.ofNullable(store.get(uuid)); }
        @Override public <S extends RoutineStep> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends RoutineStep> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends RoutineStep> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<RoutineStep> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public RoutineStep getOne(UUID uuid) { return store.get(uuid); }
        @Override public RoutineStep getById(UUID uuid) { return store.get(uuid); }
        @Override public RoutineStep getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends RoutineStep> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends RoutineStep> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends RoutineStep> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends RoutineStep> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends RoutineStep> long count(Example<S> example) { return 0; }
        @Override public <S extends RoutineStep> boolean exists(Example<S> example) { return false; }
        @Override public <S extends RoutineStep, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends RoutineStep> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public List<RoutineStep> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<RoutineStep> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void delete(RoutineStep entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends RoutineStep> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<RoutineStep> findAll(Sort sort) { return null; }
        @Override public Page<RoutineStep> findAll(Pageable pageable) { return null; }
    }

    static class FakeUserTaskRepository implements UserTaskRepository {
        private final Map<UUID, UserTask> store = new HashMap<>();
        @Override public List<UserTask> findByUserIdOrderByCompletedAscDisplayOrderAscCreatedAtDesc(UUID userId) {
            return store.values().stream().filter(t -> t.getUser().getId().equals(userId)).toList();
        }
        @Override public List<UserTask> findByUserIdAndDueDateOrderByCompletedAscDisplayOrderAsc(UUID userId, LocalDate dueDate) {
            return store.values().stream().filter(t -> t.getUser().getId().equals(userId) && Objects.equals(t.getDueDate(), dueDate)).toList();
        }
        @Override public long countByUserIdAndCompletedTrue(UUID userId) {
            return store.values().stream().filter(t -> t.getUser().getId().equals(userId) && t.isCompleted()).count();
        }
        @Override public Optional<UserTask> findById(UUID uuid) { return Optional.ofNullable(store.get(uuid)); }
        @Override public <S extends UserTask> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public void delete(UserTask entity) { store.remove(entity.getId()); }
        @Override public void flush() {}
        @Override public <S extends UserTask> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends UserTask> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<UserTask> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public UserTask getOne(UUID uuid) { return store.get(uuid); }
        @Override public UserTask getById(UUID uuid) { return store.get(uuid); }
        @Override public UserTask getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends UserTask> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends UserTask> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends UserTask> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends UserTask> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends UserTask> long count(Example<S> example) { return 0; }
        @Override public <S extends UserTask> boolean exists(Example<S> example) { return false; }
        @Override public <S extends UserTask, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends UserTask> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public List<UserTask> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<UserTask> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends UserTask> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<UserTask> findAll(Sort sort) { return null; }
        @Override public Page<UserTask> findAll(Pageable pageable) { return null; }
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
