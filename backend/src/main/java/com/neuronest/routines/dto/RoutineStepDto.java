package com.neuronest.routines.dto;

import java.util.UUID;

public class RoutineStepDto {
    private UUID id;
    private String title;
    private String detail;
    private Integer estimatedMinutes;
    private Integer stepOrder;
    private boolean completed;

    public RoutineStepDto() {}

    public RoutineStepDto(UUID id, String title, String detail, Integer estimatedMinutes, Integer stepOrder, boolean completed) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.estimatedMinutes = estimatedMinutes;
        this.stepOrder = stepOrder;
        this.completed = completed;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
