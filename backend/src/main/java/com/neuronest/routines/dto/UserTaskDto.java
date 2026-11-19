package com.neuronest.routines.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class UserTaskDto {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private boolean completed;
    private LocalDate dueDate;
    private LocalTime scheduledTime;
    private Integer displayOrder;
    private Instant createdAt;
    private Instant completedAt;

    public UserTaskDto() {}

    public UserTaskDto(
            UUID id,
            String title,
            String description,
            String category,
            String priority,
            boolean completed,
            LocalDate dueDate,
            LocalTime scheduledTime,
            Integer displayOrder,
            Instant createdAt,
            Instant completedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.completed = completed;
        this.dueDate = dueDate;
        this.scheduledTime = scheduledTime;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalTime scheduledTime) { this.scheduledTime = scheduledTime; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
