package com.neuronest.learning.repository;

import com.neuronest.learning.entity.SavedLearningContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedLearningContentRepository extends JpaRepository<SavedLearningContent, SavedLearningContent.SavedContentId> {
    List<SavedLearningContent> findByUserIdOrderBySavedAtDesc(UUID userId);
    boolean existsByUserIdAndContentId(UUID userId, UUID contentId);
    void deleteByUserIdAndContentId(UUID userId, UUID contentId);
}
