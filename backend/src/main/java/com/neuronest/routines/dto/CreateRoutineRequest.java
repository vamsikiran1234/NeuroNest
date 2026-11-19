package com.neuronest.routines.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class CreateRoutineRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String category = "MORNING";
    private String iconName = "Sun";
    private String colorCode = "sage";
    private Boolean recurring = true;

    private List<CreateStepItem> steps = new ArrayList<>();

    public CreateRoutineRequest() {}

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
    public List<CreateStepItem> getSteps() { return steps; }
    public void setSteps(List<CreateStepItem> steps) { this.steps = steps; }

    public static class CreateStepItem {
        @NotBlank
        private String title;
        private String detail;
        private Integer estimatedMinutes = 5;

        public CreateStepItem() {}
        public CreateStepItem(String title, String detail, Integer estimatedMinutes) {
            this.title = title;
            this.detail = detail;
            this.estimatedMinutes = estimatedMinutes;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
        public Integer getEstimatedMinutes() { return estimatedMinutes; }
        public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    }
}
