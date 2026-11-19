package com.neuronest.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class TaskBreakdownRequest {

    @NotBlank(message = "Task description is required")
    private String taskTitle;

    private String context;

    public TaskBreakdownRequest() {}

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
