package com.neuronest.games.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "game_favorites")
@IdClass(GameFavorite.GameFavoriteId.class)
public class GameFavorite {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "game_id", length = 50)
    private String gameId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", insertable = false, updatable = false)
    private Game game;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public GameFavorite() {}

    public GameFavorite(UUID userId, String gameId) {
        this.userId = userId;
        this.gameId = gameId;
        this.createdAt = Instant.now();
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static class GameFavoriteId implements Serializable {
        private UUID userId;
        private String gameId;

        public GameFavoriteId() {}
        public GameFavoriteId(UUID userId, String gameId) {
            this.userId = userId;
            this.gameId = gameId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof GameFavoriteId that)) return false;
            return Objects.equals(userId, that.userId) && Objects.equals(gameId, that.gameId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, gameId);
        }
    }
}
