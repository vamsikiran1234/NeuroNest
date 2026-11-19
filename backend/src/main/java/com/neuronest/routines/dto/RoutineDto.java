package com.neuronest.routines.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class RoutineDto {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private String iconName;
    private String colorCode;
    private Boolean recurring;
    private Integer displayOrder;
    private List<RoutineStepDto> steps;
    private Instant createdAt;

    public RoutineDto() {}

    public RoutineDto(
            UUID id,
            String title,
            String description,
            String category,
            String iconName,
            String colorCode,
            Boolean recurring,
            Integer displayOrder,
            List<RoutineStepDto> steps,
            Instant createdAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.iconName = iconName;
        this.colorCode = colorCode;
        this.recurring = recurring;
        this.displayOrder = displayOrder;
        this.steps = steps;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public Boolean getRecurring() { return recurring; }
    public void setRecurring(Boolean recurring) { this.recurring = recurring; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public List<RoutineStepDto> getSteps() { return steps; }
    public void setSteps(List<RoutineStepDto> steps) { this.steps = steps; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
