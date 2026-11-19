package com.neuronest.routines.controller;

import com.neuronest.auth.entity.User;
import com.neuronest.common.response.ApiResponse;
import com.neuronest.routines.dto.*;
import com.neuronest.routines.service.RoutineService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class RoutineController {

    private final RoutineService routineService;

    public RoutineController(RoutineService routineService) {
        this.routineService = routineService;
    }

    // Routines
    @GetMapping("/routines")
    public ResponseEntity<ApiResponse<List<RoutineDto>>> getRoutines(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(routineService.getRoutines(user.getId())));
    }

    @PostMapping("/routines")
    public ResponseEntity<ApiResponse<RoutineDto>> createRoutine(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateRoutineRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.createRoutine(user.getId(), request)));
    }

    @PatchMapping("/routines/steps/{stepId}/toggle")
    public ResponseEntity<ApiResponse<RoutineStepDto>> toggleRoutineStep(
            @AuthenticationPrincipal User user,
            @PathVariable UUID stepId
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.toggleStep(user.getId(), stepId)));
    }

    @PostMapping("/routines/{routineId}/reset")
    public ResponseEntity<ApiResponse<RoutineDto>> resetRoutineSteps(
            @AuthenticationPrincipal User user,
            @PathVariable UUID routineId
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.resetRoutineSteps(user.getId(), routineId)));
    }

    @DeleteMapping("/routines/{routineId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoutine(
            @AuthenticationPrincipal User user,
            @PathVariable UUID routineId
    ) {
        routineService.deleteRoutine(user.getId(), routineId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Tasks
    @GetMapping("/tasks")
    public ResponseEntity<ApiResponse<List<UserTaskDto>>> getTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.getTasks(user.getId(), date)));
    }

    @PostMapping("/tasks")
    public ResponseEntity<ApiResponse<UserTaskDto>> createTask(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateTaskRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.createTask(user.getId(), request)));
    }

    @PatchMapping("/tasks/{taskId}/toggle")
    public ResponseEntity<ApiResponse<UserTaskDto>> toggleTask(
            @AuthenticationPrincipal User user,
            @PathVariable UUID taskId
    ) {
        return ResponseEntity.ok(ApiResponse.success(routineService.toggleTask(user.getId(), taskId)));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal User user,
            @PathVariable UUID taskId
    ) {
        routineService.deleteTask(user.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
