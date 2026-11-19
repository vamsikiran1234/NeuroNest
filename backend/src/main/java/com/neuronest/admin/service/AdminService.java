package com.neuronest.admin.service;

import com.neuronest.admin.dto.*;
import com.neuronest.admin.entity.AuditLog;
import com.neuronest.admin.repository.AuditLogRepository;
import com.neuronest.ai.repository.AiInteractionMetadataRepository;
import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.games.repository.GameSessionRepository;
import com.neuronest.routines.repository.RoutineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;
    private final RoutineRepository routineRepository;
    private final AiInteractionMetadataRepository aiMetadataRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminService(
            UserRepository userRepository,
            GameSessionRepository gameSessionRepository,
            RoutineRepository routineRepository,
            AiInteractionMetadataRepository aiMetadataRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.userRepository = userRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.routineRepository = routineRepository;
        this.aiMetadataRepository = aiMetadataRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public AdminOverviewDto getOverview() {
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long totalMinors = allUsers.stream().filter(User::isMinor).count();
        long totalGames = gameSessionRepository.count();
        long totalRoutines = routineRepository.count();
        long totalAi = aiMetadataRepository.count();

        return new AdminOverviewDto(
                totalUsers,
                totalMinors,
                totalGames,
                totalRoutines,
                totalAi,
                "CONNECTED",
                "HEALTHY"
        );
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getUsers() {
        return userRepository.findAll().stream().map(u -> {
            Set<String> roleNames = u.getRoles().stream()
                    .map(r -> r.getName() != null ? r.getName().name() : "ROLE_USER")
                    .collect(Collectors.toSet());

            return new AdminUserDto(
                    u.getId(),
                    u.getEmail(),
                    u.getDisplayName(),
                    u.isMinor(),
                    u.isEmailVerified(),
                    roleNames,
                    u.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream().map(a -> new AuditLogDto(
                a.getId(),
                a.getActor() != null ? a.getActor().getEmail() : "SYSTEM",
                a.getAction(),
                a.getEntityType(),
                a.getEntityId(),
                a.getDetails(),
                a.getIpAddress(),
                a.getCreatedAt()
        )).collect(Collectors.toList());
    }

    @Transactional
    public void recordAudit(User actor, String action, String entityType, String entityId, String details, String ipAddress) {
        auditLogRepository.save(new AuditLog(actor, action, entityType, entityId, details, ipAddress));
    }
}
