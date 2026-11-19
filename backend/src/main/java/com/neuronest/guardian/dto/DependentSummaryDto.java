package com.neuronest.guardian.dto;

import java.util.List;
import java.util.UUID;

public class DependentSummaryDto {
    private UUID dependentId;
    private String displayName;
    private String presentationProfile;
    private int completedRoutinesCount;
    private int completedGamesCount;
    private List<String> favoriteTopics;
    private String privacyNotice;

    public DependentSummaryDto() {}

    public DependentSummaryDto(
            UUID dependentId,
            String displayName,
            String presentationProfile,
            int completedRoutinesCount,
            int completedGamesCount,
            List<String> favoriteTopics,
            String privacyNotice
    ) {
        this.dependentId = dependentId;
        this.displayName = displayName;
        this.presentationProfile = presentationProfile;
        this.completedRoutinesCount = completedRoutinesCount;
        this.completedGamesCount = completedGamesCount;
        this.favoriteTopics = favoriteTopics;
        this.privacyNotice = privacyNotice;
    }

    public UUID getDependentId() { return dependentId; }
    public void setDependentId(UUID dependentId) { this.dependentId = dependentId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getPresentationProfile() { return presentationProfile; }
    public void setPresentationProfile(String presentationProfile) { this.presentationProfile = presentationProfile; }
    public int getCompletedRoutinesCount() { return completedRoutinesCount; }
    public void setCompletedRoutinesCount(int completedRoutinesCount) { this.completedRoutinesCount = completedRoutinesCount; }
    public int getCompletedGamesCount() { return completedGamesCount; }
    public void setCompletedGamesCount(int completedGamesCount) { this.completedGamesCount = completedGamesCount; }
    public List<String> getFavoriteTopics() { return favoriteTopics; }
    public void setFavoriteTopics(List<String> favoriteTopics) { this.favoriteTopics = favoriteTopics; }
    public String getPrivacyNotice() { return privacyNotice; }
    public void setPrivacyNotice(String privacyNotice) { this.privacyNotice = privacyNotice; }
}
