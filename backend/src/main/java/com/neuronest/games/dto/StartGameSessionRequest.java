package com.neuronest.games.dto;

import jakarta.validation.constraints.NotBlank;

public class StartGameSessionRequest {

    @NotBlank(message = "Difficulty is required")
    private String difficulty = "BEGINNER";

    public StartGameSessionRequest() {}

    public StartGameSessionRequest(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
