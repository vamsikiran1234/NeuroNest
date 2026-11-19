package com.neuronest.ai.dto;

import java.util.List;

public class GameRecommendationRequest {
    private String currentMood; // NEED_FOCUS, NEED_CALM, FEELING_CREATIVE, LIFE_PRACTICE
    private List<String> interests;

    public GameRecommendationRequest() {}

    public String getCurrentMood() { return currentMood; }
    public void setCurrentMood(String currentMood) { this.currentMood = currentMood; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
}
