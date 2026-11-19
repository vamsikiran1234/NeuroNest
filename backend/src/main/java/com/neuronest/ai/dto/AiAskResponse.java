package com.neuronest.ai.dto;

public class AiAskResponse {
    private String answer;
    private String encouragingTakeaway;
    private boolean fallbackUsed;

    public AiAskResponse() {}

    public AiAskResponse(String answer, String encouragingTakeaway, boolean fallbackUsed) {
        this.answer = answer;
        this.encouragingTakeaway = encouragingTakeaway;
        this.fallbackUsed = fallbackUsed;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getEncouragingTakeaway() { return encouragingTakeaway; }
    public void setEncouragingTakeaway(String encouragingTakeaway) { this.encouragingTakeaway = encouragingTakeaway; }
    public boolean isFallbackUsed() { return fallbackUsed; }
    public void setFallbackUsed(boolean fallbackUsed) { this.fallbackUsed = fallbackUsed; }
}
