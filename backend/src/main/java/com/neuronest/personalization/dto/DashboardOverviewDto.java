package com.neuronest.personalization.dto;

import java.util.List;
import java.util.Map;

public class DashboardOverviewDto {
    private String greeting;
    private String preferredName;
    private String presentationProfile;
    private String quote;
    private boolean quietMode;
    private List<Map<String, Object>> todayActivities;
    private List<Map<String, Object>> recommendedGames;
    private List<Map<String, Object>> activeGoals;
    private Map<String, Object> weeklyGrowthSummary;

    public DashboardOverviewDto() {}

    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
    public String getPreferredName() { return preferredName; }
    public void setPreferredName(String preferredName) { this.preferredName = preferredName; }
    public String getPresentationProfile() { return presentationProfile; }
    public void setPresentationProfile(String presentationProfile) { this.presentationProfile = presentationProfile; }
    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public boolean isQuietMode() { return quietMode; }
    public void setQuietMode(boolean quietMode) { this.quietMode = quietMode; }
    public List<Map<String, Object>> getTodayActivities() { return todayActivities; }
    public void setTodayActivities(List<Map<String, Object>> todayActivities) { this.todayActivities = todayActivities; }
    public List<Map<String, Object>> getRecommendedGames() { return recommendedGames; }
    public void setRecommendedGames(List<Map<String, Object>> recommendedGames) { this.recommendedGames = recommendedGames; }
    public List<Map<String, Object>> getActiveGoals() { return activeGoals; }
    public void setActiveGoals(List<Map<String, Object>> activeGoals) { this.activeGoals = activeGoals; }
    public Map<String, Object> getWeeklyGrowthSummary() { return weeklyGrowthSummary; }
    public void setWeeklyGrowthSummary(Map<String, Object> weeklyGrowthSummary) { this.weeklyGrowthSummary = weeklyGrowthSummary; }
}
