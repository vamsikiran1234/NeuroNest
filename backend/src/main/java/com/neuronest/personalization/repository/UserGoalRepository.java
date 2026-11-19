package com.neuronest.personalization.repository;

import com.neuronest.personalization.entity.UserGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserGoalRepository extends JpaRepository<UserGoal, UUID> {
    List<UserGoal> findByUserId(UUID userId);
    List<UserGoal> findByUserIdAndStatus(UUID userId, String status);
}
