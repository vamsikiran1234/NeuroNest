package com.neuronest.games.controller;

import com.neuronest.common.response.ApiResponse;
import com.neuronest.common.security.UserPrincipal;
import com.neuronest.games.dto.*;
import com.neuronest.games.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/games")
@Tag(name = "Educational Games", description = "Endpoints for game catalog, verified session management, and achievements")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/categories")
    @Operation(summary = "Get list of all game skill categories")
    public ResponseEntity<ApiResponse<List<GameCategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(gameService.getCategories()));
    }

    @GetMapping
    @Operation(summary = "Get all active games in the platform")
    public ResponseEntity<ApiResponse<List<GameDto>>> getAllGames(@AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(gameService.getAllGames(userId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific game details and instructions by ID")
    public ResponseEntity<ApiResponse<GameDto>> getGameById(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(gameService.getGameById(id, userId)));
    }

    @PostMapping("/{id}/sessions")
    @Operation(summary = "Start a new game session with verified tracking on the backend")
    public ResponseEntity<ApiResponse<GameSessionDto>> createSession(
            @PathVariable("id") String gameId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody(required = false) StartGameSessionRequest request) {
        StartGameSessionRequest req = request != null ? request : new StartGameSessionRequest("BEGINNER");
        GameSessionDto session = gameService.createSession(principal.getId(), gameId, req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(session, "Game session started"));
    }

    @PostMapping("/sessions/{sessionId}/complete")
    @Operation(summary = "Submit and validate completed game session score and results")
    public ResponseEntity<ApiResponse<GameSessionDto>> completeSession(
            @PathVariable("sessionId") UUID sessionId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CompleteGameSessionRequest request) {
        GameSessionDto session = gameService.completeSession(principal.getId(), sessionId, request);
        return ResponseEntity.ok(ApiResponse.success(session, "Session completed and verified"));
    }

    @GetMapping("/history")
    @Operation(summary = "Get authenticated user game history")
    public ResponseEntity<ApiResponse<List<GameSessionDto>>> getHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(gameService.getUserGameHistory(principal.getId())));
    }

    @PostMapping("/{id}/favorites")
    @Operation(summary = "Toggle favorite status for a game")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleFavorite(
            @PathVariable("id") String gameId,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isFav = gameService.toggleFavorite(principal.getId(), gameId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("favorite", isFav)));
    }

    @GetMapping("/achievements")
    @Operation(summary = "Get user earned achievements & milestones")
    public ResponseEntity<ApiResponse<List<GameAchievementDto>>> getAchievements(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(gameService.getUserAchievements(principal.getId())));
    }
}
