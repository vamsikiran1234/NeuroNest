package com.neuronest.games.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "game_categories")
public class GameCategory {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName = "Gamepad2";

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public GameCategory() {}

    public GameCategory(String id, String name, String description, String iconName, Integer displayOrder) {
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
