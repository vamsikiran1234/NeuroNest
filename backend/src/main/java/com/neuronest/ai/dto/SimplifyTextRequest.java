package com.neuronest.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class SimplifyTextRequest {

    @NotBlank(message = "Text to simplify is required")
    private String text;

    private String level = "ACCESSIBLE"; // SIMPLE, SUMMARY, BULLETS

    public SimplifyTextRequest() {}

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
