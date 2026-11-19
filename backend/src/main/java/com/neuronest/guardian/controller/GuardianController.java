package com.neuronest.guardian.controller;

import com.neuronest.auth.entity.User;
import com.neuronest.common.response.ApiResponse;
import com.neuronest.guardian.dto.*;
import com.neuronest.guardian.service.GuardianService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/guardian")
public class GuardianController {

    private final GuardianService guardianService;

    public GuardianController(GuardianService guardianService) {
        this.guardianService = guardianService;
    }

    @GetMapping("/relationships")
    public ResponseEntity<ApiResponse<List<GuardianRelationshipDto>>> getRelationships(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(guardianService.getRelationships(user.getId())));
    }

    @PostMapping("/relationships")
    public ResponseEntity<ApiResponse<GuardianRelationshipDto>> linkDependent(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody LinkDependentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(guardianService.linkDependent(user.getId(), request)));
    }

    @GetMapping("/dependents/{dependentId}/consents")
    public ResponseEntity<ApiResponse<List<ConsentRecordDto>>> getConsentRecords(
            @PathVariable UUID dependentId
    ) {
        return ResponseEntity.ok(ApiResponse.success(guardianService.getConsentRecords(dependentId)));
    }

    @PostMapping("/dependents/{dependentId}/consents")
    public ResponseEntity<ApiResponse<ConsentRecordDto>> updateConsent(
            @AuthenticationPrincipal User user,
            @PathVariable UUID dependentId,
            @Valid @RequestBody UpdateConsentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(guardianService.updateConsent(user.getId(), dependentId, request)));
    }

    @GetMapping("/dependents/{dependentId}/summary")
    public ResponseEntity<ApiResponse<DependentSummaryDto>> getDependentSummary(
            @AuthenticationPrincipal User user,
            @PathVariable UUID dependentId
    ) {
        return ResponseEntity.ok(ApiResponse.success(guardianService.getDependentSummary(user.getId(), dependentId)));
    }
}
