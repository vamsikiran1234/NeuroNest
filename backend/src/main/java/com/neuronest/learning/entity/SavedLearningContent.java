package com.neuronest.learning.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "saved_learning_contents")
@IdClass(SavedLearningContent.SavedContentId.class)
public class SavedLearningContent {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "content_id")
    private UUID contentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content_id", insertable = false, updatable = false)
    private LearningContent content;

    @Column(name = "saved_at", nullable = false)
    private Instant savedAt = Instant.now();

    @Column(columnDefinition = "TEXT")
    private String notes;

    public SavedLearningContent() {}

    public SavedLearningContent(UUID userId, UUID contentId) {
        this.userId = userId;
        this.contentId = contentId;
        this.savedAt = Instant.now();
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getContentId() { return contentId; }
    public void setContentId(UUID contentId) { this.contentId = contentId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LearningContent getContent() { return content; }
    public void setContent(LearningContent content) { this.content = content; }
    public Instant getSavedAt() { return savedAt; }
    public void setSavedAt(Instant savedAt) { this.savedAt = savedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static class SavedContentId implements Serializable {
        private UUID userId;
        private UUID contentId;

        public SavedContentId() {}
        public SavedContentId(UUID userId, UUID contentId) {
            this.userId = userId;
            this.contentId = contentId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof SavedContentId that)) return false;
            return Objects.equals(userId, that.userId) && Objects.equals(contentId, that.contentId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, contentId);
        }
    }
}
