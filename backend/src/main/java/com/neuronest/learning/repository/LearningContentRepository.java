package com.neuronest.learning.repository;

import com.neuronest.learning.entity.LearningContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LearningContentRepository extends JpaRepository<LearningContent, UUID> {
    List<LearningContent> findByCategoryId(String categoryId);
}
