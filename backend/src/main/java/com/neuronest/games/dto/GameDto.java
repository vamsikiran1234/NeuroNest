package com.neuronest.games.dto;

import java.util.List;

public class GameDto {
    private String id;
    private String categoryId;
    private String categoryName;
    private String title;
    private String tagline;
    private String description;
    private String instructions;
    private List<String> skillsPracticed;
    private Integer estimatedMinutes;
    private List<String> supportedDifficulties;
    private String thumbnailUrl;
    private boolean favorite;

    public GameDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public List<String> getSkillsPracticed() { return skillsPracticed; }
    public void setSkillsPracticed(List<String> skillsPracticed) { this.skillsPracticed = skillsPracticed; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public List<String> getSupportedDifficulties() { return supportedDifficulties; }
    public void setSupportedDifficulties(List<String> supportedDifficulties) { this.supportedDifficulties = supportedDifficulties; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public boolean isFavorite() { return favorite; }
    public void setFavorite(boolean favorite) { this.favorite = favorite; }
}
