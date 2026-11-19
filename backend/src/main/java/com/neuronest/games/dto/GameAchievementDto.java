package com.neuronest.games.dto;

import java.time.Instant;
import java.util.UUID;

public class GameAchievementDto {
    private UUID id;
    private String badgeKey;
    private String title;
    private String description;
    private String iconName;
    private Instant earnedAt;

    public GameAchievementDto() {}

    public GameAchievementDto(UUID id, String badgeKey, String title, String description, String iconName, Instant earnedAt) {
        this.id = id;
        this.badgeKey = badgeKey;
        this.title = title;
        this.description = description;
        this.iconName = iconName;
        this.earnedAt = earnedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getBadgeKey() { return badgeKey; }
    public void setBadgeKey(String badgeKey) { this.badgeKey = badgeKey; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    public Instant getEarnedAt() { return earnedAt; }
    public void setEarnedAt(Instant earnedAt) { this.earnedAt = earnedAt; }
}
