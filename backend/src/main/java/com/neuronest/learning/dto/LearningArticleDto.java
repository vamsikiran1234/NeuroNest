package com.neuronest.learning.dto;

import java.time.Instant;
import java.util.UUID;

public class LearningArticleDto {
    private UUID id;
    private String categoryId;
    private String categoryName;
    private String title;
    private String summary;
    private String originalText;
    private String simplifiedText;
    private String readingLevel;
    private Integer estimatedReadMinutes;
    private boolean saved;
    private Instant createdAt;

    public LearningArticleDto() {}

    public LearningArticleDto(
            UUID id,
            String categoryId,
            String categoryName,
            String title,
            String summary,
            String originalText,
            String simplifiedText,
            String readingLevel,
            Integer estimatedReadMinutes,
            boolean saved,
            Instant createdAt
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.title = title;
        this.summary = summary;
        this.originalText = originalText;
        this.simplifiedText = simplifiedText;
        this.readingLevel = readingLevel;
        this.estimatedReadMinutes = estimatedReadMinutes;
        this.saved = saved;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }
    public String getSimplifiedText() { return simplifiedText; }
    public void setSimplifiedText(String simplifiedText) { this.simplifiedText = simplifiedText; }
    public String getReadingLevel() { return readingLevel; }
    public void setReadingLevel(String readingLevel) { this.readingLevel = readingLevel; }
    public Integer getEstimatedReadMinutes() { return estimatedReadMinutes; }
    public void setEstimatedReadMinutes(Integer estimatedReadMinutes) { this.estimatedReadMinutes = estimatedReadMinutes; }
    public boolean isSaved() { return saved; }
    public void setSaved(boolean saved) { this.saved = saved; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
