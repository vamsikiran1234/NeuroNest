package com.neuronest.personalization.dto;

import java.util.List;

public class OnboardingRequest {
    private String presentationProfile; // YOUNG_EXPLORERS, INDEPENDENT_LEARNERS, EVERYDAY_COMPANION
    private String preferredName;
    private List<String> interests;
    private List<String> goals;
    private String defaultGameDifficulty;
    private Integer preferredSessionMinutes;
    private String themePreset;
    private String fontFamily;
    private String fontSize;
    private String lineSpacing;
    private Boolean reducedMotion;
    private Boolean soundEffectsEnabled;

    public OnboardingRequest() {}

    public String getPresentationProfile() { return presentationProfile; }
    public void setPresentationProfile(String presentationProfile) { this.presentationProfile = presentationProfile; }
    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }
    public String getDefaultGameDifficulty() { return defaultGameDifficulty; }
    public void setDefaultGameDifficulty(String defaultGameDifficulty) { this.defaultGameDifficulty = defaultGameDifficulty; }
    public Integer getPreferredSessionMinutes() { return preferredSessionMinutes; }
    public void setPreferredSessionMinutes(Integer preferredSessionMinutes) { this.preferredSessionMinutes = preferredSessionMinutes; }
    public String getThemePreset() { return themePreset; }
    public void setThemePreset(String themePreset) { this.themePreset = themePreset; }
    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
    public String getFontSize() { return fontSize; }
    public void setFontSize(String fontSize) { this.fontSize = fontSize; }
    public String getLineSpacing() { return lineSpacing; }
    public void setLineSpacing(String lineSpacing) { this.lineSpacing = lineSpacing; }
    public Boolean getReducedMotion() { return reducedMotion; }
    public void setReducedMotion(Boolean reducedMotion) { this.reducedMotion = reducedMotion; }
    public Boolean getSoundEffectsEnabled() { return soundEffectsEnabled; }
    public void setSoundEffectsEnabled(Boolean soundEffectsEnabled) { this.soundEffectsEnabled = soundEffectsEnabled; }
}
