package com.neuronest.personalization.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 500)
    private String bio;

    @Column(name = "avatar_id", length = 50)
    private String avatarId = "owl-calm";

    @Column(name = "preferred_name", length = 100)
    private String preferredName;

    @Column(name = "presentation_profile", nullable = false, length = 50)
    private String presentationProfile = "INDEPENDENT_LEARNERS"; // YOUNG_EXPLORERS, INDEPENDENT_LEARNERS, EVERYDAY_COMPANION

    @Column(name = "onboarding_completed", nullable = false)
    private boolean onboardingCompleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserProfile() {}

    public UserProfile(User user) {
        this.user = user;
        this.userId = user.getId();
        this.preferredName = user.getDisplayName();
        this.createdAt = Instant.now();
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
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarId() { return avatarId; }
    public void setAvatarId(String avatarId) { this.avatarId = avatarId; }
    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }
    public String getPresentationProfile() { return presentationProfile; }
    public void setPresentationProfile(String presentationProfile) { this.presentationProfile = presentationProfile; }
    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
