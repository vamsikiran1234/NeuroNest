package com.neuronest.personalization.dto;

import java.util.UUID;

public class UserProfileDto {
    private UUID userId;
    private String preferredName;
    private String bio;
    private String avatarId;
    private String presentationProfile;
    private boolean onboardingCompleted;

    public UserProfileDto() {}

    public UserProfileDto(UUID userId, String preferredName, String bio, String avatarId, String presentationProfile, boolean onboardingCompleted) {
        this.userId = userId;
        this.preferredName = preferredName;
        this.bio = bio;
        this.avatarId = avatarId;
        this.presentationProfile = presentationProfile;
        this.onboardingCompleted = onboardingCompleted;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarId() { return avatarId; }
    public void setAvatarId(String avatarId) { this.avatarId = avatarId; }
    public String getPresentationProfile() { return presentationProfile; }
    public void setPresentationProfile(String presentationProfile) { this.presentationProfile = presentationProfile; }
    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }
}
