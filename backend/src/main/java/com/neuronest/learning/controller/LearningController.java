package com.neuronest.learning.controller;

import com.neuronest.auth.entity.User;
import com.neuronest.common.response.ApiResponse;
import com.neuronest.learning.dto.LearningArticleDto;
import com.neuronest.learning.dto.LearningCategoryDto;
import com.neuronest.learning.service.LearningService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/learning")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<LearningCategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(learningService.getCategories()));
    }

    @GetMapping("/articles")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getArticles(
            @RequestParam(required = false) String category,
            @AuthenticationPrincipal User user
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(learningService.getArticles(category, userId)));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<LearningArticleDto>> getArticleById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        UUID userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(ApiResponse.success(learningService.getArticleById(id, userId)));
    }

    @PostMapping("/articles/{id}/toggle-save")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleSaveArticle(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        boolean isSaved = learningService.toggleSaveArticle(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("saved", isSaved)));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<LearningArticleDto>>> getSavedArticles(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(learningService.getSavedArticles(user.getId())));
    }
}
