package com.neuronest.personalization.controller;

import com.neuronest.common.response.ApiResponse;
import com.neuronest.common.security.UserPrincipal;
import com.neuronest.personalization.dto.*;
import com.neuronest.personalization.service.PersonalizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/personalization")
@Tag(name = "Personalization & Onboarding", description = "Endpoints for onboarding, user profiles, interests, and dashboard overview")
public class PersonalizationController {

    private final PersonalizationService personalizationService;

    public PersonalizationController(PersonalizationService personalizationService) {
        this.personalizationService = personalizationService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user profile and presentation mode")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.getProfile(principal.getId())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.updateProfile(principal.getId(), dto)));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get user preferences and interests")
    public ResponseEntity<ApiResponse<UserPreferencesDto>> getPreferences(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.getPreferences(principal.getId())));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update user preferences")
    public ResponseEntity<ApiResponse<UserPreferencesDto>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserPreferencesDto dto) {
        return ResponseEntity.ok(ApiResponse.success(personalizationService.updatePreferences(principal.getId(), dto)));
    }

    @PostMapping("/onboarding")
    @Operation(summary = "Complete multi-step onboarding wizard and save presentation preferences")
    public ResponseEntity<ApiResponse<UserProfileDto>> completeOnboarding(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody OnboardingRequest request) {
        UserProfileDto profile = personalizationService.completeOnboarding(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(profile, "Onboarding personalized successfully"));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated personalized home dashboard data")
    public ResponseEntity<ApiResponse<DashboardOverviewDto>> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        DashboardOverviewDto overview = personalizationService.getDashboardOverview(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(overview));
    }
}
