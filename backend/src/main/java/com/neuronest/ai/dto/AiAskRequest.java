package com.neuronest.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class AiAskRequest {

    @NotBlank(message = "Question or prompt is required")
    private String prompt;

    private String topic;

    public AiAskRequest() {}

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
