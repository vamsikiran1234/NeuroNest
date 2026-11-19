package com.neuronest.ai.dto;

import java.util.List;

public class TaskBreakdownResponse {
    private String taskTitle;
    private String encouragingAdvice;
    private List<MicroStep> steps;
    private boolean fallbackUsed;

    public TaskBreakdownResponse() {}

    public TaskBreakdownResponse(String taskTitle, String encouragingAdvice, List<MicroStep> steps, boolean fallbackUsed) {
        this.taskTitle = taskTitle;
        this.encouragingAdvice = encouragingAdvice;
        this.steps = steps;
        this.fallbackUsed = fallbackUsed;
    }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }
    public String getEncouragingAdvice() { return encouragingAdvice; }
    public void setEncouragingAdvice(String encouragingAdvice) { this.encouragingAdvice = encouragingAdvice; }
    public List<MicroStep> getSteps() { return steps; }
    public void setSteps(List<MicroStep> steps) { this.steps = steps; }
    public boolean isFallbackUsed() { return fallbackUsed; }
    public void setFallbackUsed(boolean fallbackUsed) { this.fallbackUsed = fallbackUsed; }

    public static class MicroStep {
        private int stepNumber;
        private String title;
        private String detail;
        private int estimatedMinutes;

        public MicroStep() {}
        public MicroStep(int stepNumber, String title, String detail, int estimatedMinutes) {
            this.stepNumber = stepNumber;
            this.title = title;
            this.detail = detail;
            this.estimatedMinutes = estimatedMinutes;
        }

        public int getStepNumber() { return stepNumber; }
        public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
        public int getEstimatedMinutes() { return estimatedMinutes; }
        public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    }
}
