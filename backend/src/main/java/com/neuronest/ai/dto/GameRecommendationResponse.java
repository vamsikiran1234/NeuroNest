package com.neuronest.ai.dto;

import java.util.List;

public class GameRecommendationResponse {
    private String friendlyMessage;
    private List<RecommendedGameItem> recommendations;
    private boolean fallbackUsed;

    public GameRecommendationResponse() {}

    public GameRecommendationResponse(String friendlyMessage, List<RecommendedGameItem> recommendations, boolean fallbackUsed) {
        this.friendlyMessage = friendlyMessage;
        this.recommendations = recommendations;
        this.fallbackUsed = fallbackUsed;
    }

    public String getFriendlyMessage() { return friendlyMessage; }
    public void setFriendlyMessage(String friendlyMessage) { this.friendlyMessage = friendlyMessage; }
    public List<RecommendedGameItem> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendedGameItem> recommendations) { this.recommendations = recommendations; }
    public boolean isFallbackUsed() { return fallbackUsed; }
    public void setFallbackUsed(boolean fallbackUsed) { this.fallbackUsed = fallbackUsed; }

    public static class RecommendedGameItem {
        private String gameId;
        private String title;
        private String reason;
        private String category;

        public RecommendedGameItem() {}
        public RecommendedGameItem(String gameId, String title, String reason, String category) {
            this.gameId = gameId;
            this.title = title;
            this.reason = reason;
            this.category = category;
        }

        public String getGameId() { return gameId; }
        public void setGameId(String gameId) { this.gameId = gameId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
