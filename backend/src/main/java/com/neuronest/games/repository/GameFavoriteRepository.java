package com.neuronest.games.repository;

import com.neuronest.games.entity.GameFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameFavoriteRepository extends JpaRepository<GameFavorite, GameFavorite.GameFavoriteId> {
    List<GameFavorite> findByUserId(UUID userId);
    boolean existsByUserIdAndGameId(UUID userId, String gameId);
    void deleteByUserIdAndGameId(UUID userId, String gameId);
}
