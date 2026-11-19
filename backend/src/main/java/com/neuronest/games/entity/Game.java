package com.neuronest.games.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private GameCategory category;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 255)
    private String tagline;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String instructions;

    @Column(name = "skills_practiced", columnDefinition = "text[]")
    private String[] skillsPracticed = new String[]{};

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes = 5;

    @Column(name = "supported_difficulties", columnDefinition = "text[]")
    private String[] supportedDifficulties = new String[]{"BEGINNER", "INTERMEDIATE", "ADVANCED"};

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Game() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public GameCategory getCategory() { return category; }
    public void setCategory(GameCategory category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String[] getSkillsPracticed() { return skillsPracticed; }
    public void setSkillsPracticed(String[] skillsPracticed) { this.skillsPracticed = skillsPracticed; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public String[] getSupportedDifficulties() { return supportedDifficulties; }
    public void setSupportedDifficulties(String[] supportedDifficulties) { this.supportedDifficulties = supportedDifficulties; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
