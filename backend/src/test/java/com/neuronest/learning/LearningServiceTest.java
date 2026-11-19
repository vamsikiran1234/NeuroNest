package com.neuronest.learning;

import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.learning.dto.LearningArticleDto;
import com.neuronest.learning.entity.LearningCategory;
import com.neuronest.learning.entity.LearningContent;
import com.neuronest.learning.entity.SavedLearningContent;
import com.neuronest.learning.repository.LearningCategoryRepository;
import com.neuronest.learning.repository.LearningContentRepository;
import com.neuronest.learning.repository.SavedLearningContentRepository;
import com.neuronest.learning.service.LearningService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.FluentQuery;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class LearningServiceTest {

    private FakeCategoryRepository categoryRepository;
    private FakeContentRepository contentRepository;
    private FakeSavedRepository savedRepository;
    private FakeUserRepository userRepository;

    private LearningService learningService;
    private User testUser;
    private LearningCategory testCategory;
    private LearningContent testArticle;

    @BeforeEach
    void setUp() {
        categoryRepository = new FakeCategoryRepository();
        contentRepository = new FakeContentRepository();
        savedRepository = new FakeSavedRepository();
        userRepository = new FakeUserRepository();

        learningService = new LearningService(categoryRepository, contentRepository, savedRepository, userRepository);

        testUser = new User("reader@neuronest.dev", "hashed_pwd", "Sam", false);
        testUser.setId(UUID.randomUUID());
        testUser.getRoles().add(new Role(RoleName.ROLE_USER, "Standard user"));
        userRepository.save(testUser);

        testCategory = new LearningCategory("SCIENCE_NATURE", "Science & Nature", "Explore nature", "TreePine");
        categoryRepository.save(testCategory);

        testArticle = new LearningContent();
        testArticle.setId(UUID.randomUUID());
        testArticle.setCategory(testCategory);
        testArticle.setTitle("The Secrets of the Honeybee Dance");
        testArticle.setSummary("How bees communicate directions");
        testArticle.setOriginalText("Long text explaining bee dance");
        testArticle.setSimplifiedText("Short simple text");
        testArticle.setReadingLevel("ACCESSIBLE");
        testArticle.setEstimatedReadMinutes(3);
        contentRepository.save(testArticle);
    }

    @Test
    @DisplayName("Lists all accessible learning articles")
    void testGetArticles() {
        List<LearningArticleDto> articles = learningService.getArticles(null, testUser.getId());
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals("The Secrets of the Honeybee Dance", articles.get(0).getTitle());
        assertFalse(articles.get(0).isSaved());
    }

    @Test
    @DisplayName("Toggles saving an article for reading later")
    void testToggleSaveArticle() {
        boolean savedFirst = learningService.toggleSaveArticle(testArticle.getId(), testUser.getId());
        assertTrue(savedFirst);

        LearningArticleDto article = learningService.getArticleById(testArticle.getId(), testUser.getId());
        assertTrue(article.isSaved());

        // Unsave
        boolean savedSecond = learningService.toggleSaveArticle(testArticle.getId(), testUser.getId());
        assertFalse(savedSecond);
    }

    // Fakes
    static class FakeCategoryRepository implements LearningCategoryRepository {
        private final Map<String, LearningCategory> store = new HashMap<>();
        @Override public List<LearningCategory> findAll() { return new ArrayList<>(store.values()); }
        @Override public <S extends LearningCategory> S save(S entity) { store.put(entity.getId(), entity); return entity; }
        @Override public void flush() {}
        @Override public <S extends LearningCategory> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends LearningCategory> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<LearningCategory> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<String> strings) {}
        @Override public void deleteAllInBatch() {}
        @Override public LearningCategory getOne(String s) { return store.get(s); }
        @Override public LearningCategory getById(String s) { return store.get(s); }
        @Override public LearningCategory getReferenceById(String s) { return store.get(s); }
        @Override public <S extends LearningCategory> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends LearningCategory> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends LearningCategory> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends LearningCategory> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends LearningCategory> long count(Example<S> example) { return 0; }
        @Override public <S extends LearningCategory> boolean exists(Example<S> example) { return false; }
        @Override public <S extends LearningCategory, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends LearningCategory> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<LearningCategory> findById(String s) { return Optional.ofNullable(store.get(s)); }
        @Override public boolean existsById(String s) { return store.containsKey(s); }
        @Override public List<LearningCategory> findAllById(Iterable<String> strings) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(String s) { store.remove(s); }
        @Override public void delete(LearningCategory entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends String> strings) {}
        @Override public void deleteAll(Iterable<? extends LearningCategory> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<LearningCategory> findAll(Sort sort) { return null; }
        @Override public Page<LearningCategory> findAll(Pageable pageable) { return null; }
    }

    static class FakeContentRepository implements LearningContentRepository {
        private final Map<UUID, LearningContent> store = new HashMap<>();
        @Override public List<LearningContent> findByCategoryId(String categoryId) {
            return store.values().stream().filter(c -> c.getCategory() != null && categoryId.equalsIgnoreCase(c.getCategory().getId())).toList();
        }
        @Override public Optional<LearningContent> findById(UUID uuid) { return Optional.ofNullable(store.get(uuid)); }
        @Override public List<LearningContent> findAll() { return new ArrayList<>(store.values()); }
        @Override public <S extends LearningContent> S save(S entity) {
            if (entity.getId() == null) entity.setId(UUID.randomUUID());
            store.put(entity.getId(), entity);
            return entity;
        }
        @Override public void flush() {}
        @Override public <S extends LearningContent> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends LearningContent> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<LearningContent> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public LearningContent getOne(UUID uuid) { return store.get(uuid); }
        @Override public LearningContent getById(UUID uuid) { return store.get(uuid); }
        @Override public LearningContent getReferenceById(UUID uuid) { return store.get(uuid); }
        @Override public <S extends LearningContent> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends LearningContent> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends LearningContent> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends LearningContent> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends LearningContent> long count(Example<S> example) { return 0; }
        @Override public <S extends LearningContent> boolean exists(Example<S> example) { return false; }
        @Override public <S extends LearningContent, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends LearningContent> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public boolean existsById(UUID uuid) { return store.containsKey(uuid); }
        @Override public List<LearningContent> findAllById(Iterable<UUID> uuids) { return null; }
        @Override public long count() { return store.size(); }
        @Override public void deleteById(UUID uuid) { store.remove(uuid); }
        @Override public void delete(LearningContent entity) { store.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends LearningContent> entities) {}
        @Override public void deleteAll() { store.clear(); }
        @Override public List<LearningContent> findAll(Sort sort) { return null; }
        @Override public Page<LearningContent> findAll(Pageable pageable) { return null; }
    }

    static class FakeSavedRepository implements SavedLearningContentRepository {
        private final List<SavedLearningContent> list = new ArrayList<>();
        @Override public List<SavedLearningContent> findByUserIdOrderBySavedAtDesc(UUID userId) {
            return list.stream().filter(s -> s.getUserId().equals(userId)).toList();
        }
        @Override public boolean existsByUserIdAndContentId(UUID userId, UUID contentId) {
            return list.stream().anyMatch(s -> s.getUserId().equals(userId) && s.getContentId().equals(contentId));
        }
        @Override public void deleteByUserIdAndContentId(UUID userId, UUID contentId) {
            list.removeIf(s -> s.getUserId().equals(userId) && s.getContentId().equals(contentId));
        }
        @Override public void flush() {}
        @Override public <S extends SavedLearningContent> S saveAndFlush(S entity) { return null; }
        @Override public <S extends SavedLearningContent> List<S> saveAllAndFlush(Iterable<S> entities) { return null; }
        @Override public void deleteAllInBatch(Iterable<SavedLearningContent> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<SavedLearningContent.SavedContentId> ids) {}
        @Override public void deleteAllInBatch() {}
        @Override public SavedLearningContent getOne(SavedLearningContent.SavedContentId id) { return null; }
        @Override public SavedLearningContent getById(SavedLearningContent.SavedContentId id) { return null; }
        @Override public SavedLearningContent getReferenceById(SavedLearningContent.SavedContentId id) { return null; }
        @Override public <S extends SavedLearningContent> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends SavedLearningContent> List<S> findAll(Example<S> example) { return null; }
        @Override public <S extends SavedLearningContent> List<S> findAll(Example<S> example, Sort sort) { return null; }
        @Override public <S extends SavedLearningContent> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends SavedLearningContent> long count(Example<S> example) { return 0; }
        @Override public <S extends SavedLearningContent> boolean exists(Example<S> example) { return false; }
        @Override public <S extends SavedLearningContent, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends SavedLearningContent> S save(S entity) { list.add(entity); return entity; }
        @Override public <S extends SavedLearningContent> List<S> saveAll(Iterable<S> entities) { return null; }
        @Override public Optional<SavedLearningContent> findById(SavedLearningContent.SavedContentId id) { return Optional.empty(); }
        @Override public boolean existsById(SavedLearningContent.SavedContentId id) { return false; }
        @Override public List<SavedLearningContent> findAll() { return list; }
        @Override public List<SavedLearningContent> findAllById(Iterable<SavedLearningContent.SavedContentId> ids) { return null; }
        @Override public long count() { return list.size(); }
        @Override public void deleteById(SavedLearningContent.SavedContentId id) {}
        @Override public void delete(SavedLearningContent entity) { list.remove(entity); }
        @Override public void deleteAllById(Iterable<? extends SavedLearningContent.SavedContentId> ids) {}
        @Override public void deleteAll(Iterable<? extends SavedLearningContent> entities) {}
        @Override public void deleteAll() { list.clear(); }
        @Override public List<SavedLearningContent> findAll(Sort sort) { return null; }
        @Override public Page<SavedLearningContent> findAll(Pageable pageable) { return null; }
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
