package com.neuronest.games;

import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.games.dto.*;
import com.neuronest.games.entity.*;
import com.neuronest.games.repository.*;
import com.neuronest.games.service.GameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    private FakeGameRepository gameRepository;
    private FakeGameCategoryRepository categoryRepository;
    private FakeGameSessionRepository sessionRepository;
    private FakeGameFavoriteRepository favoriteRepository;
    private FakeGameAchievementRepository achievementRepository;
    private FakeUserRepository userRepository;

    private GameService gameService;
    private User testUser;
    private Game testGame;
    private GameCategory testCategory;

    @BeforeEach
    void setUp() {
        gameRepository = new FakeGameRepository();
        categoryRepository = new FakeGameCategoryRepository();
        sessionRepository = new FakeGameSessionRepository();
        favoriteRepository = new FakeGameFavoriteRepository();
        achievementRepository = new FakeGameAchievementRepository();
        userRepository = new FakeUserRepository();

        gameService = new GameService(
                gameRepository,
                categoryRepository,
                sessionRepository,
                favoriteRepository,
                achievementRepository,
                userRepository
        );

        testUser = new User("explorer@neuronest.dev", "hashed_pwd", "Alex", false);
        testUser.setId(UUID.randomUUID());
        testUser.getRoles().add(new Role(RoleName.ROLE_USER, "Standard user"));
        userRepository.save(testUser);

        testCategory = new GameCategory("MEMORY", "Memory & Recall", "Calm memory games", "Brain", 1);
        categoryRepository.save(testCategory);

        testGame = new Game();
        testGame.setId("memory-garden");
        testGame.setTitle("Memory Garden");
        testGame.setCategory(testCategory);
        testGame.setDescription("Pair calming nature cards");
        testGame.setInstructions("Flip cards to find pairs");
        testGame.setActive(true);
        testGame.setEstimatedMinutes(5);
        gameRepository.save(testGame);
    }

    @Test
    @DisplayName("Successfully starts a new game session with BEGINNER difficulty")
    void testStartGameSession() {
        StartGameSessionRequest request = new StartGameSessionRequest("BEGINNER");
        GameSessionDto session = gameService.createSession(testUser.getId(), testGame.getId(), request);

        assertNotNull(session);
        assertEquals("memory-garden", session.getGameId());
        assertEquals("STARTED", session.getStatus());
        assertEquals("BEGINNER", session.getDifficulty());
    }

    @Test
    @DisplayName("Completes a game session with positive non-punitive scoring")
    void testCompleteGameSession() {
        StartGameSessionRequest startReq = new StartGameSessionRequest("BEGINNER");
        GameSessionDto created = gameService.createSession(testUser.getId(), testGame.getId(), startReq);

        CompleteGameSessionRequest completeReq = new CompleteGameSessionRequest();
        completeReq.setAttempts(10);
        completeReq.setCorrectCount(8);
        completeReq.setIncorrectCount(2);
        completeReq.setDurationSeconds(120);
        completeReq.setScore(150);
        completeReq.setFeedbackNotes("Great focus and patience shown during the activity!");

        GameSessionDto completed = gameService.completeSession(testUser.getId(), created.getId(), completeReq);

        assertNotNull(completed);
        assertEquals("COMPLETED", completed.getStatus());
        assertEquals(8, completed.getCorrectCount());
        assertEquals(150, completed.getScore());
        assertEquals("Great focus and patience shown during the activity!", completed.getFeedbackNotes());
    }

    @Test
    @DisplayName("Throws NOT_FOUND when starting a session for non-existent game")
    void testStartSessionNonExistentGame() {
        StartGameSessionRequest req = new StartGameSessionRequest("BEGINNER");
        assertThrows(AppException.class, () ->
                gameService.createSession(testUser.getId(), "non-existent-game", req)
        );
    }

    // Lightweight in-memory test doubles

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

    static class FakeGameRepository implements GameRepository {
        private final Map<String, Game> store = new HashMap<>();

        @Override public Optional<Game> findById(String id) { return Optional.ofNullable(store.get(id)); }
        @Override public List<Game> findByActiveTrue() {
            return store.values().stream().filter(Game::isActive).toList();
        }
        @Override public List<Game> findByCategoryIdAndActiveTrue(String categoryId) {
            return store.values().stream().filter(g -> g.getCategory() != null && categoryId.equalsIgnoreCase(g.getCategory().getId()) && g.isActive()).toList();
        }
        @Override public <S extends Game> S save(S entity) {
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public <S extends Game> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public List<Game> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<Game> findAllById(Iterable<String> strings) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(String s) { store.remove(s); }
        @Override public void delete(Game entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends String> strings) {}
        @Override public void deleteAll(Iterable<? extends Game> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public boolean existsById(String s) { return store.containsKey(s); }
        @Override public void flush() {}
        @Override public <S extends Game> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Game> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<Game> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<String> strings) {}
        @Override public void deleteAllInBatch() {}
        @Override public Game getOne(String s) { return store.get(s); }
        @Override public Game getById(String s) { return store.get(s); }
        @Override public Game getReferenceById(String s) { return store.get(s); }
        @Override public <S extends Game> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Game> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends Game> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends Game> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends Game> long count(Example<S> example) { return 0; }
        @Override public <S extends Game> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Game, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public List<Game> findAll(Sort sort) { return null; }
        @Override public Page<Game> findAll(Pageable pageable) { return null; }
    }

    static class FakeGameCategoryRepository implements GameCategoryRepository {
        private final Map<String, GameCategory> store = new HashMap<>();

        @Override public List<GameCategory> findAllByOrderByDisplayOrderAsc() {
            return store.values().stream().sorted(Comparator.comparingInt(GameCategory::getDisplayOrder)).toList();
        }
        @Override public void flush() {}
        @Override public <S extends GameCategory> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends GameCategory> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<GameCategory> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<String> strings) {}
        @Override public void deleteAllInBatch() {}
        @Override public GameCategory getOne(String s) { return null; }
        @Override public GameCategory getById(String s) { return null; }
        @Override public GameCategory getReferenceById(String s) { return null; }
        @Override public <S extends GameCategory> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends GameCategory> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends GameCategory> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends GameCategory> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends GameCategory> long count(Example<S> example) { return 0; }
        @Override public <S extends GameCategory> boolean exists(Example<S> example) { return false; }
        @Override public <S extends GameCategory, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends GameCategory> S save(S entity) {
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public <S extends GameCategory> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<GameCategory> findById(String s) { return Optional.ofNullable(store.get(s)); }
        @Override public boolean existsById(String s) { return store.containsKey(s); }
        @Override public List<GameCategory> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<GameCategory> findAllById(Iterable<String> strings) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(String s) { store.remove(s); }
        @Override public void delete(GameCategory entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends String> strings) {}
        @Override public void deleteAll(Iterable<? extends GameCategory> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<GameCategory> findAll(Sort sort) { return null; }
        @Override public Page<GameCategory> findAll(Pageable pageable) { return null; }
    }

    static class FakeGameSessionRepository implements GameSessionRepository {
        private final Map<UUID, GameSession> store = new HashMap<>();

        @Override public Optional<GameSession> findById(UUID id) { return Optional.ofNullable(store.get(id)); }
        @Override public List<GameSession> findByUserIdOrderByStartedAtDesc(UUID userId) {
            return store.values().stream().filter(s -> s.getUser().getId().equals(userId)).toList();
        }
        @Override public Page<GameSession> findByUserIdOrderByStartedAtDesc(UUID userId, Pageable pageable) {
            List<GameSession> filtered = store.values().stream().filter(s -> s.getUser().getId().equals(userId)).toList();
            return new PageImpl<>(filtered, pageable, filtered.size());
        }
        @Override public long countByUserIdAndStatus(UUID userId, String status) {
            return store.values().stream().filter(s -> s.getUser().getId().equals(userId) && status.equalsIgnoreCase(s.getStatus())).count();
        }
        @Override public <S extends GameSession> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends GameSession> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends GameSession> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<GameSession> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public GameSession getOne(UUID uuid) { return store.get(uuid); }
        @Override public GameSession getById(UUID uuid) { return store.get(uuid); }
        @Override public GameSession getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends GameSession> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends GameSession> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends GameSession> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends GameSession> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends GameSession> long count(Example<S> example) { return 0; }
        @Override public <S extends GameSession> boolean exists(Example<S> example) { return false; }
        @Override public <S extends GameSession, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends GameSession> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public List<GameSession> findAll() { return new ArrayList<>(store.values()); }
        @Override public List<GameSession> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void delete(GameSession entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends GameSession> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<GameSession> findAll(Sort sort) { return null; }
        @Override public Page<GameSession> findAll(Pageable pageable) { return null; }
    }

    static class FakeGameFavoriteRepository implements GameFavoriteRepository {
        private final List<GameFavorite> favorites = new ArrayList<>();

        @Override public List<GameFavorite> findByUserId(UUID userId) {
            return favorites.stream().filter(f -> f.getUserId().equals(userId)).toList();
        }
        @Override public boolean existsByUserIdAndGameId(UUID userId, String gameId) {
            return favorites.stream().anyMatch(f -> f.getUserId().equals(userId) && f.getGameId().equals(gameId));
        }
        @Override public void deleteByUserIdAndGameId(UUID userId, String gameId) {
            favorites.removeIf(f -> f.getUserId().equals(userId) && f.getGameId().equals(gameId));
        }
        @Override public void flush() {}
        @Override public <S extends GameFavorite> S saveAndFlush(S entity) { return null; }
        @Override public <S extends GameFavorite> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<GameFavorite> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<GameFavorite.GameFavoriteId> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public GameFavorite getOne(GameFavorite.GameFavoriteId id) { return null; }
        @Override public GameFavorite getById(GameFavorite.GameFavoriteId id) { return null; }
        @Override public GameFavorite getReferenceById(GameFavorite.GameFavoriteId id) { return null; }
        @Override public <S extends GameFavorite> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends GameFavorite> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends GameFavorite> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends GameFavorite> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends GameFavorite> long count(Example<S> example) { return 0; }
        @Override public <S extends GameFavorite> boolean exists(Example<S> example) { return false; }
        @Override public <S extends GameFavorite, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends GameFavorite> S save(S entity) {
            favorites.add(entity);
            return entity;
        }
        @Override public <S extends GameFavorite> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<GameFavorite> findById(GameFavorite.GameFavoriteId id) { return Optional.empty(); }
        @Override public boolean existsById(GameFavorite.GameFavoriteId id) { return false; }
        @Override public List<GameFavorite> findAll() { return favorites; }
        @Override public List<GameFavorite> findAllById(Iterable<GameFavorite.GameFavoriteId> ids) { return null; }
        @Override public long count() { return favorites.size(); }
        @Override public void deleteById(GameFavorite.GameFavoriteId id) {}
        @Override public void delete(GameFavorite entity) { favorites.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends GameFavorite.GameFavoriteId> ids) {}
        @Override public void deleteAll(Iterable<? extends GameFavorite> entities) {}
        @Override public void deleteAll() { favorites.clear(); }
        @Override public List<GameFavorite> findAll(Sort sort) { return null; }
        @Override public Page<GameFavorite> findAll(Pageable pageable) { return null; }
    }

    static class FakeGameAchievementRepository implements GameAchievementRepository {
        private final List<GameAchievement> list = new ArrayList<>();

        @Override public List<GameAchievement> findByUserIdOrderByEarnedAtDesc(UUID userId) {
            return list.stream().filter(a -> a.getUser().getId().equals(userId)).toList();
        }
        @Override public boolean existsByUserIdAndBadgeKey(UUID userId, String badgeKey) {
            return list.stream().anyMatch(a -> a.getUser().getId().equals(userId) && a.getBadgeKey().equals(badgeKey));
        }
        @Override public void flush() {}
        @Override public <S extends GameAchievement> S saveAndFlush(S entity) { return null; }
        @Override public <S extends GameAchievement> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<GameAchievement> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public GameAchievement getOne(UUID uuid) { return null; }
        @Override public GameAchievement getById(UUID uuid) { return null; }
        @Override public GameAchievement getReferenceById(UUID uuid) { return null; }
        @Override public <S extends GameAchievement> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends GameAchievement> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends GameAchievement> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends GameAchievement> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends GameAchievement> long count(Example<S> example) { return 0; }
        @Override public <S extends GameAchievement> boolean exists(Example<S> example) { return false; }
        @Override public <S extends GameAchievement, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends GameAchievement> S save(S entity) {
            list.add(entity);
            return entity;
        }
        @Override public <S extends GameAchievement> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<GameAchievement> findById(UUID uuid) { return Optional.empty(); }
        @Override public boolean existsById(UUID uuid) { return false; }
        @Override public List<GameAchievement> findAll() { return list; }
        @Override public List<GameAchievement> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(UUID uuid) {}
        @Override public void delete(GameAchievement entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends GameAchievement> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<GameAchievement> findAll(Sort sort) { return null; }
        @Override public Page<GameAchievement> findAll(Pageable pageable) { return null; }
    }
}
