package com.neuronest.ai.controller;

import com.neuronest.ai.dto.*;
import com.neuronest.ai.service.AiService;
import com.neuronest.auth.entity.User;
import com.neuronest.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/simplify")
    public ResponseEntity<ApiResponse<SimplifyTextResponse>> simplifyText(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SimplifyTextRequest request
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(aiService.simplifyText(userId, request)));
    }

    @PostMapping("/breakdown-task")
    public ResponseEntity<ApiResponse<TaskBreakdownResponse>> breakdownTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskBreakdownRequest request
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(aiService.breakdownTask(userId, request)));
    }

    @PostMapping("/recommend-games")
    public ResponseEntity<ApiResponse<GameRecommendationResponse>> recommendGames(
            @AuthenticationPrincipal User user,
            @RequestBody GameRecommendationRequest request
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(aiService.recommendGames(userId, request)));
    }

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<AiAskResponse>> askAssistant(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AiAskRequest request
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(aiService.askAssistant(userId, request)));
    }
}
