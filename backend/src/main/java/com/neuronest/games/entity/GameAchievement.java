package com.neuronest.games.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "game_achievements")
public class GameAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "badge_key", nullable = false, length = 100)
    private String badgeKey;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName = "Award";

    @Column(name = "earned_at", nullable = false)
    private Instant earnedAt = Instant.now();

    public GameAchievement() {}

    public GameAchievement(User user, String badgeKey, String title, String description, String iconName) {
        this.user = user;
        this.badgeKey = badgeKey;
        this.title = title;
        this.description = description;
        this.iconName = iconName;
        this.earnedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
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
