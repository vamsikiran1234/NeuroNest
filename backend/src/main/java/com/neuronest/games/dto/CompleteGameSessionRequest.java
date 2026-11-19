package com.neuronest.games.dto;

import jakarta.validation.constraints.Min;

public class CompleteGameSessionRequest {

    @Min(0)
    private int durationSeconds;

    @Min(0)
    private int attempts;

    @Min(0)
    private int correctCount;

    @Min(0)
    private int incorrectCount;

    @Min(0)
    private int score;

    private String feedbackNotes;

    public CompleteGameSessionRequest() {}

    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }
    public int getCorrectCount() { return correctCount; }
    public void setCorrectCount(int correctCount) { this.correctCount = correctCount; }
    public int getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(int incorrectCount) { this.incorrectCount = incorrectCount; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }
}
