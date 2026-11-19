package com.neuronest.personalization.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "text[]")
    private String[] interests = new String[]{};

    @Column(name = "game_categories_preferred", columnDefinition = "text[]")
    private String[] gameCategoriesPreferred = new String[]{};

    @Column(name = "default_game_difficulty", length = 50)
    private String defaultGameDifficulty = "BEGINNER";

    @Column(name = "preferred_session_minutes")
    private Integer preferredSessionMinutes = 15;

    @Column(name = "instruction_mode", length = 50)
    private String instructionMode = "TEXT_AND_AUDIO";

    @Column(name = "quiet_mode_enabled")
    private Boolean quietModeEnabled = false;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserPreferences() {}

    public UserPreferences(User user) {
        this.user = user;
        this.userId = user.getId();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String[] getInterests() { return interests; }
    public void setInterests(String[] interests) { this.interests = interests; }
    public String[] getGameCategoriesPreferred() { return gameCategoriesPreferred; }
    public void setGameCategoriesPreferred(String[] gameCategoriesPreferred) { this.gameCategoriesPreferred = gameCategoriesPreferred; }
    public String getDefaultGameDifficulty() { return defaultGameDifficulty; }
    public void setDefaultGameDifficulty(String defaultGameDifficulty) { this.defaultGameDifficulty = defaultGameDifficulty; }
    public Integer getPreferredSessionMinutes() { return preferredSessionMinutes; }
    public void setPreferredSessionMinutes(Integer preferredSessionMinutes) { this.preferredSessionMinutes = preferredSessionMinutes; }
    public String getInstructionMode() { return instructionMode; }
    public void setInstructionMode(String instructionMode) { this.instructionMode = instructionMode; }
    public Boolean getQuietModeEnabled() { return quietModeEnabled; }
    public void setQuietModeEnabled(Boolean quietModeEnabled) { this.quietModeEnabled = quietModeEnabled; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
