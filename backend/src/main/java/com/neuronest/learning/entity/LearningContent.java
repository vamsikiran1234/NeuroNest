package com.neuronest.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "learning_contents")
public class LearningContent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private LearningCategory category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(name = "original_text", columnDefinition = "TEXT", nullable = false)
    private String originalText;

    @Column(name = "simplified_text", columnDefinition = "TEXT")
    private String simplifiedText;

    @Column(name = "reading_level", length = 50)
    private String readingLevel = "ACCESSIBLE";

    @Column(name = "estimated_read_minutes")
    private Integer estimatedReadMinutes = 4;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public LearningContent() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LearningCategory getCategory() { return category; }
    public void setCategory(LearningCategory category) { this.category = category; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
