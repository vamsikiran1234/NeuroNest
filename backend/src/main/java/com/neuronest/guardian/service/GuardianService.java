package com.neuronest.guardian.service;

import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.games.repository.GameSessionRepository;
import com.neuronest.guardian.dto.*;
import com.neuronest.guardian.entity.ConsentRecord;
import com.neuronest.guardian.entity.GuardianRelationship;
import com.neuronest.guardian.repository.ConsentRecordRepository;
import com.neuronest.guardian.repository.GuardianRelationshipRepository;
import com.neuronest.personalization.entity.UserProfile;
import com.neuronest.personalization.entity.UserPreferences;
import com.neuronest.personalization.repository.UserProfileRepository;
import com.neuronest.personalization.repository.UserPreferencesRepository;
import com.neuronest.routines.repository.RoutineRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GuardianService {

    private final GuardianRelationshipRepository relationshipRepository;
    private final ConsentRecordRepository consentRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final GameSessionRepository gameSessionRepository;
    private final RoutineRepository routineRepository;

    public GuardianService(
            GuardianRelationshipRepository relationshipRepository,
            ConsentRecordRepository consentRepository,
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            UserPreferencesRepository userPreferencesRepository,
            GameSessionRepository gameSessionRepository,
            RoutineRepository routineRepository
    ) {
        this.relationshipRepository = relationshipRepository;
        this.consentRepository = consentRepository;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.routineRepository = routineRepository;
    }

    @Transactional(readOnly = true)
    public List<GuardianRelationshipDto> getRelationships(UUID guardianId) {
        return relationshipRepository.findByGuardianId(guardianId).stream()
                .map(this::mapToRelationshipDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GuardianRelationshipDto linkDependent(UUID guardianId, LinkDependentRequest request) {
        User guardian = userRepository.findById(guardianId)
                .orElseThrow(() -> new AppException("Guardian not found", HttpStatus.NOT_FOUND));

        User dependent = userRepository.findByEmail(request.getDependentEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException("Dependent user not found with email: " + request.getDependentEmail(), HttpStatus.NOT_FOUND));

        if (guardian.getId().equals(dependent.getId())) {
            throw new AppException("Cannot link yourself as dependent", HttpStatus.BAD_REQUEST);
        }

        if (relationshipRepository.existsByGuardianIdAndDependentId(guardianId, dependent.getId())) {
            throw new AppException("Relationship already established", HttpStatus.CONFLICT);
        }

        GuardianRelationship rel = new GuardianRelationship(guardian, dependent, request.getRelationshipType());
        GuardianRelationship saved = relationshipRepository.save(rel);

        // Ensure default consent records exist for minor
        if (dependent.isMinor()) {
            ensureDefaultConsents(dependent, guardian);
        }

        return mapToRelationshipDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ConsentRecordDto> getConsentRecords(UUID dependentId) {
        return consentRepository.findByUserId(dependentId).stream()
                .map(c -> new ConsentRecordDto(c.getId(), c.getConsentType(), c.isGranted(), c.getNotes(), c.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public ConsentRecordDto updateConsent(UUID guardianId, UUID dependentId, UpdateConsentRequest request) {
        GuardianRelationship rel = relationshipRepository.findByGuardianIdAndDependentId(guardianId, dependentId)
                .orElseThrow(() -> new AppException("No guardian relationship found for dependent", HttpStatus.FORBIDDEN));

        ConsentRecord record = consentRepository.findByUserIdAndConsentType(dependentId, request.getConsentType())
                .orElseGet(() -> new ConsentRecord(rel.getDependent(), rel.getGuardian(), request.getConsentType(), true, null));

        record.setGranted(request.isGranted());
        record.setNotes(request.getNotes());
        ConsentRecord saved = consentRepository.save(record);

        return new ConsentRecordDto(saved.getId(), saved.getConsentType(), saved.isGranted(), saved.getNotes(), saved.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public DependentSummaryDto getDependentSummary(UUID guardianId, UUID dependentId) {
        GuardianRelationship rel = relationshipRepository.findByGuardianIdAndDependentId(guardianId, dependentId)
                .orElseThrow(() -> new AppException("Unauthorized access to dependent summary", HttpStatus.FORBIDDEN));

        if (!rel.isCanViewActivitySummary()) {
            throw new AppException("Activity summary viewing is disabled by relationship settings", HttpStatus.FORBIDDEN);
        }

        User dep = rel.getDependent();
        UserProfile profile = userProfileRepository.findById(dep.getId()).orElse(null);

        long gamesCompleted = gameSessionRepository.countByUserIdAndStatus(dep.getId(), "COMPLETED");
        int routineCount = routineRepository.findByUserIdOrderByDisplayOrderAscCreatedAtAsc(dep.getId()).size();

        String profileName = profile != null ? profile.getPresentationProfile() : "Independent Learners";
        UserPreferences prefs = userPreferencesRepository.findById(dep.getId()).orElse(null);
        List<String> interests = prefs != null && prefs.getInterests() != null && prefs.getInterests().length > 0
                ? Arrays.asList(prefs.getInterests())
                : List.of("Science & Nature", "Creative Stories");

        String privacyNotice = "Child Privacy Guarantee: Raw user journal writings and individual exploratory attempts are never displayed. Only encouraging milestone summaries and comfortable preferences are shown.";

        return new DependentSummaryDto(
                dep.getId(),
                dep.getDisplayName(),
                profileName,
                routineCount,
                (int) gamesCompleted,
                interests,
                privacyNotice
        );
    }

    private void ensureDefaultConsents(User dependent, User guardian) {
        List<String> required = List.of("MINOR_ACCOUNT_CREATION", "DATA_STORAGE", "AI_ASSISTANCE");
        for (String type : required) {
            if (consentRepository.findByUserIdAndConsentType(dependent.getId(), type).isEmpty()) {
                consentRepository.save(new ConsentRecord(dependent, guardian, type, true, "Initial parental consent upon account link"));
            }
        }
    }

    private GuardianRelationshipDto mapToRelationshipDto(GuardianRelationship r) {
        return new GuardianRelationshipDto(
                r.getId(),
                r.getDependent().getId(),
                r.getDependent().getDisplayName(),
                r.getDependent().getEmail(),
                r.getRelationshipType(),
                r.getStatus(),
                r.isCanViewActivitySummary(),
                r.isCanManageGoals(),
                r.isCanConfigureReminders(),
                r.getCreatedAt()
        );
    }
}
