package com.neuronest.learning.service;

import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.learning.dto.LearningArticleDto;
import com.neuronest.learning.dto.LearningCategoryDto;
import com.neuronest.learning.entity.LearningCategory;
import com.neuronest.learning.entity.LearningContent;
import com.neuronest.learning.entity.SavedLearningContent;
import com.neuronest.learning.repository.LearningCategoryRepository;
import com.neuronest.learning.repository.LearningContentRepository;
import com.neuronest.learning.repository.SavedLearningContentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LearningService {

    private final LearningCategoryRepository categoryRepository;
    private final LearningContentRepository contentRepository;
    private final SavedLearningContentRepository savedRepository;
    private final UserRepository userRepository;

    public LearningService(
            LearningCategoryRepository categoryRepository,
            LearningContentRepository contentRepository,
            SavedLearningContentRepository savedRepository,
            UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.contentRepository = contentRepository;
        this.savedRepository = savedRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<LearningCategoryDto> getCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new LearningCategoryDto(c.getId(), c.getName(), c.getDescription(), c.getIconName()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LearningArticleDto> getArticles(String categoryId, UUID userId) {
        List<LearningContent> contents = (categoryId != null && !categoryId.isBlank() && !categoryId.equalsIgnoreCase("ALL"))
                ? contentRepository.findByCategoryId(categoryId)
                : contentRepository.findAll();

        Set<UUID> savedIds = userId != null
                ? savedRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(SavedLearningContent::getContentId)
                .collect(Collectors.toSet())
                : Collections.emptySet();

        return contents.stream()
                .map(c -> mapToDto(c, savedIds.contains(c.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LearningArticleDto getArticleById(UUID articleId, UUID userId) {
        LearningContent content = contentRepository.findById(articleId)
                .orElseThrow(() -> new AppException("Article not found: " + articleId, HttpStatus.NOT_FOUND));

        boolean isSaved = userId != null && savedRepository.existsByUserIdAndContentId(userId, articleId);
        return mapToDto(content, isSaved);
    }

    @Transactional
    public boolean toggleSaveArticle(UUID articleId, UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        contentRepository.findById(articleId)
                .orElseThrow(() -> new AppException("Article not found", HttpStatus.NOT_FOUND));

        if (savedRepository.existsByUserIdAndContentId(userId, articleId)) {
            savedRepository.deleteByUserIdAndContentId(userId, articleId);
            return false;
        } else {
            savedRepository.save(new SavedLearningContent(userId, articleId));
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<LearningArticleDto> getSavedArticles(UUID userId) {
        return savedRepository.findByUserIdOrderBySavedAtDesc(userId).stream()
                .map(s -> mapToDto(s.getContent(), true))
                .collect(Collectors.toList());
    }

    private LearningArticleDto mapToDto(LearningContent c, boolean saved) {
        return new LearningArticleDto(
                c.getId(),
                c.getCategory() != null ? c.getCategory().getId() : null,
                c.getCategory() != null ? c.getCategory().getName() : null,
                c.getTitle(),
                c.getSummary(),
                c.getOriginalText(),
                c.getSimplifiedText(),
                c.getReadingLevel(),
                c.getEstimatedReadMinutes(),
                saved,
                c.getCreatedAt()
        );
    }
}
