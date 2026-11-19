package com.neuronest.games.repository;

import com.neuronest.games.entity.GameSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, UUID> {
    List<GameSession> findByUserIdOrderByStartedAtDesc(UUID userId);
    Page<GameSession> findByUserIdOrderByStartedAtDesc(UUID userId, Pageable pageable);
    long countByUserIdAndStatus(UUID userId, String status);
}
