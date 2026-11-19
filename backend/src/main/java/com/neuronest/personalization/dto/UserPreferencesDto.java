package com.neuronest.personalization.dto;

import java.util.List;

public class UserPreferencesDto {
    private List<String> interests;
    private List<String> gameCategoriesPreferred;
    private String defaultGameDifficulty;
    private Integer preferredSessionMinutes;
    private String instructionMode;
    private Boolean quietModeEnabled;

    public UserPreferencesDto() {}

    public UserPreferencesDto(List<String> interests, List<String> gameCategoriesPreferred, String defaultGameDifficulty, Integer preferredSessionMinutes, String instructionMode, Boolean quietModeEnabled) {
        this.interests = interests;
        this.gameCategoriesPreferred = gameCategoriesPreferred;
        this.defaultGameDifficulty = defaultGameDifficulty;
        this.preferredSessionMinutes = preferredSessionMinutes;
        this.instructionMode = instructionMode;
        this.quietModeEnabled = quietModeEnabled;
    }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public List<String> getGameCategoriesPreferred() { return gameCategoriesPreferred; }
    public void setGameCategoriesPreferred(List<String> gameCategoriesPreferred) { this.gameCategoriesPreferred = gameCategoriesPreferred; }
    public String getDefaultGameDifficulty() { return defaultGameDifficulty; }
    public void setDefaultGameDifficulty(String defaultGameDifficulty) { this.defaultGameDifficulty = defaultGameDifficulty; }
    public Integer getPreferredSessionMinutes() { return preferredSessionMinutes; }
    public void setPreferredSessionMinutes(Integer preferredSessionMinutes) { this.preferredSessionMinutes = preferredSessionMinutes; }
    public String getInstructionMode() { return instructionMode; }
    public void setInstructionMode(String instructionMode) { this.instructionMode = instructionMode; }
    public Boolean getQuietModeEnabled() { return quietModeEnabled; }
    public void setQuietModeEnabled(Boolean quietModeEnabled) { this.quietModeEnabled = quietModeEnabled; }
}
