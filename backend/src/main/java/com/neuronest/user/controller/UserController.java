package com.neuronest.user.controller;

import com.neuronest.auth.dto.UserDto;
import com.neuronest.auth.service.AuthService;
import com.neuronest.common.response.ApiResponse;
import com.neuronest.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Profile", description = "Current authenticated user profile endpoints")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user")
    public ResponseEntity<ApiResponse<UserDto>> getMe(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto userDto = authService.getCurrentUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }
}
