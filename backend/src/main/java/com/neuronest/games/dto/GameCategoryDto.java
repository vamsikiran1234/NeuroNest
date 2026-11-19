package com.neuronest.games.dto;

public class GameCategoryDto {
    private String id;
    private String name;
    private String description;
    private String iconName;
    private Integer displayOrder;

    public GameCategoryDto() {}

    public GameCategoryDto(String id, String name, String description, String iconName, Integer displayOrder) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.displayOrder = displayOrder;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
