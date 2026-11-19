package com.neuronest.auth.service;

import com.neuronest.auth.dto.*;
import com.neuronest.auth.entity.*;
import com.neuronest.auth.repository.*;
import com.neuronest.common.exception.AppException;
import com.neuronest.common.security.JwtService;
import com.neuronest.common.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new AppException("Email address is already in use.", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName().trim());
        user.setMinor(request.isMinor());
        user.setAccountStatus("ACTIVE");

        RoleName targetRole = request.getRole() != null ? request.getRole() : RoleName.ROLE_USER;
        Role role = roleRepository.findByName(targetRole)
                .orElseGet(() -> roleRepository.save(new Role(targetRole, targetRole.name())));
        user.setRoles(Collections.singleton(role));

        User savedUser = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String accessToken = jwtService.generateAccessToken(principal);
        String refreshToken = createRefreshToken(savedUser);

        return new AuthResponse(accessToken, refreshToken, mapToDto(savedUser));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        String accessToken = jwtService.generateAccessToken(principal);
        String refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken, mapToDto(user));
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(request.getRefreshToken())
                .orElseThrow(() -> new AppException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED));

        if (token.isRevoked() || token.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new AppException("Refresh token has expired or was revoked. Please log in again.", HttpStatus.UNAUTHORIZED);
        }

        User user = token.getUser();
        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtService.generateAccessToken(principal);

        // Rotate refresh token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        String newRefreshToken = createRefreshToken(user);

        return new AuthResponse(newAccessToken, newRefreshToken, mapToDto(user));
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByTokenHash(refreshToken).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return mapToDto(user);
    }

    private String createRefreshToken(User user) {
        String tokenString = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshExpirationMs());

        RefreshToken refreshToken = new RefreshToken(user, tokenString, expiresAt);
        refreshTokenRepository.save(refreshToken);
        return tokenString;
    }

    public UserDto mapToDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAccountStatus(),
                user.isEmailVerified(),
                user.isMinor(),
                roleNames,
                user.getCreatedAt()
        );
    }
}
