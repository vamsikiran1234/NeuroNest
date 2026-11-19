package com.neuronest.accessibility.controller;

import com.neuronest.accessibility.dto.AccessibilitySettingsDto;
import com.neuronest.common.response.ApiResponse;
import com.neuronest.common.security.UserPrincipal;
import com.neuronest.personalization.service.PersonalizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/accessibility")
@Tag(name = "Accessibility Settings", description = "Endpoints for sensory, typography, and comfort preferences")
public class AccessibilityController {

    private final PersonalizationService personalizationService;

    public AccessibilityController(PersonalizationService personalizationService) {
        this.personalizationService = personalizationService;
    }

    @GetMapping("/settings")
    @Operation(summary = "Get user accessibility settings")
    public ResponseEntity<ApiResponse<AccessibilitySettingsDto>> getSettings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.getAccessibility(principal.getId())));
    }

    @PutMapping("/settings")
    @Operation(summary = "Update user accessibility settings")
    public ResponseEntity<ApiResponse<AccessibilitySettingsDto>> updateSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AccessibilitySettingsDto dto) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.updateAccessibility(principal.getId(), dto)));
    }
}
