package com.neuronest.games.repository;

import com.neuronest.games.entity.GameAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameAchievementRepository extends JpaRepository<GameAchievement, UUID> {
    List<GameAchievement> findByUserIdOrderByEarnedAtDesc(UUID userId);
    boolean existsByUserIdAndBadgeKey(UUID userId, String badgeKey);
}
