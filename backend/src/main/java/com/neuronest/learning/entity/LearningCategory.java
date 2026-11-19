package com.neuronest.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_categories")
public class LearningCategory {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 50)
    private String iconName = "BookOpen";

    public LearningCategory() {}

    public LearningCategory(String id, String name, String description, String iconName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
