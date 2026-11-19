package com.neuronest.learning.repository;

import com.neuronest.learning.entity.LearningCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningCategoryRepository extends JpaRepository<LearningCategory, String> {
}
