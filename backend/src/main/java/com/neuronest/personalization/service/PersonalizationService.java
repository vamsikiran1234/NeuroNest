package com.neuronest.personalization.service;

import com.neuronest.accessibility.dto.AccessibilitySettingsDto;
import com.neuronest.accessibility.entity.AccessibilitySettingsEntity;
import com.neuronest.accessibility.repository.AccessibilitySettingsRepository;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.personalization.dto.*;
import com.neuronest.personalization.entity.UserGoal;
import com.neuronest.personalization.entity.UserPreferences;
import com.neuronest.personalization.entity.UserProfile;
import com.neuronest.personalization.repository.UserGoalRepository;
import com.neuronest.personalization.repository.UserPreferencesRepository;
import com.neuronest.personalization.repository.UserProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;

@Service
public class PersonalizationService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final AccessibilitySettingsRepository accessibilitySettingsRepository;
    private final UserGoalRepository userGoalRepository;

    public PersonalizationService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            UserPreferencesRepository userPreferencesRepository,
            AccessibilitySettingsRepository accessibilitySettingsRepository,
            UserGoalRepository userGoalRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.accessibilitySettingsRepository = accessibilitySettingsRepository;
        this.userGoalRepository = userGoalRepository;
    }

    @Transactional
    public UserProfileDto getProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        return new UserProfileDto(
                profile.getUserId(),
                profile.getPreferredName(),
                profile.getBio(),
                profile.getAvatarId(),
                profile.getPresentationProfile(),
                profile.isOnboardingCompleted()
        );
    }

    @Transactional
    public UserProfileDto updateProfile(UUID userId, UserProfileDto dto) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));

        if (dto.getPreferredName() != null) profile.setPreferredName(dto.getPreferredName());
        if (dto.getBio() != null) profile.setBio(dto.getBio());
        if (dto.getAvatarId() != null) profile.setAvatarId(dto.getAvatarId());
        if (dto.getPresentationProfile() != null) profile.setPresentationProfile(dto.getPresentationProfile());
        profile.setOnboardingCompleted(dto.isOnboardingCompleted());

        userProfileRepository.save(profile);
        return getProfile(userId);
    }

    @Transactional
    public UserPreferencesDto getPreferences(UUID userId) {
        UserPreferences prefs = userPreferencesRepository.findById(userId)
                .orElseGet(() -> createDefaultPreferences(userId));

        return new UserPreferencesDto(
                prefs.getInterests() != null ? Arrays.asList(prefs.getInterests()) : Collections.emptyList(),
                prefs.getGameCategoriesPreferred() != null ? Arrays.asList(prefs.getGameCategoriesPreferred()) : Collections.emptyList(),
                prefs.getDefaultGameDifficulty(),
                prefs.getPreferredSessionMinutes(),
                prefs.getInstructionMode(),
                prefs.getQuietModeEnabled()
        );
    }

    @Transactional
    public UserPreferencesDto updatePreferences(UUID userId, UserPreferencesDto dto) {
        UserPreferences prefs = userPreferencesRepository.findById(userId)
                .orElseGet(() -> createDefaultPreferences(userId));

        if (dto.getInterests() != null) prefs.setInterests(dto.getInterests().toArray(new String[0]));
        if (dto.getGameCategoriesPreferred() != null) prefs.setGameCategoriesPreferred(dto.getGameCategoriesPreferred().toArray(new String[0]));
        if (dto.getDefaultGameDifficulty() != null) prefs.setDefaultGameDifficulty(dto.getDefaultGameDifficulty());
        if (dto.getPreferredSessionMinutes() != null) prefs.setPreferredSessionMinutes(dto.getPreferredSessionMinutes());
        if (dto.getInstructionMode() != null) prefs.setInstructionMode(dto.getInstructionMode());
        if (dto.getQuietModeEnabled() != null) prefs.setQuietModeEnabled(dto.getQuietModeEnabled());

        userPreferencesRepository.save(prefs);
        return getPreferences(userId);
    }

    @Transactional
    public AccessibilitySettingsDto getAccessibility(UUID userId) {
        AccessibilitySettingsEntity entity = accessibilitySettingsRepository.findById(userId)
                .orElseGet(() -> createDefaultAccessibility(userId));

        return new AccessibilitySettingsDto(
                entity.getFontFamily(),
                entity.getFontSize(),
                entity.getLineSpacing(),
                entity.getLetterSpacing(),
                entity.getThemePreset(),
                entity.getContrastMode(),
                entity.isAnimationsEnabled(),
                entity.isReducedMotion(),
                entity.isSoundEffectsEnabled(),
                entity.getSoundVolume(),
                entity.isReadingRulerEnabled(),
                entity.isSimplifiedNavigation()
        );
    }

    @Transactional
    public AccessibilitySettingsDto updateAccessibility(UUID userId, AccessibilitySettingsDto dto) {
        AccessibilitySettingsEntity entity = accessibilitySettingsRepository.findById(userId)
                .orElseGet(() -> createDefaultAccessibility(userId));

        if (dto.getFontFamily() != null) entity.setFontFamily(dto.getFontFamily());
        if (dto.getFontSize() != null) entity.setFontSize(dto.getFontSize());
        if (dto.getLineSpacing() != null) entity.setLineSpacing(dto.getLineSpacing());
        if (dto.getLetterSpacing() != null) entity.setLetterSpacing(dto.getLetterSpacing());
        if (dto.getThemePreset() != null) entity.setThemePreset(dto.getThemePreset());
        if (dto.getContrastMode() != null) entity.setContrastMode(dto.getContrastMode());
        entity.setAnimationsEnabled(dto.isAnimationsEnabled());
        entity.setReducedMotion(dto.isReducedMotion());
        entity.setSoundEffectsEnabled(dto.isSoundEffectsEnabled());
        entity.setSoundVolume(dto.getSoundVolume());
        entity.setReadingRulerEnabled(dto.isReadingRulerEnabled());
        entity.setSimplifiedNavigation(dto.isSimplifiedNavigation());

        accessibilitySettingsRepository.save(entity);
        return getAccessibility(userId);
    }

    @Transactional
    public UserProfileDto completeOnboarding(UUID userId, OnboardingRequest request) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        if (request.getPresentationProfile() != null) {
            profile.setPresentationProfile(request.getPresentationProfile());
        }
        if (request.getPreferredName() != null && !request.getPreferredName().isBlank()) {
            profile.setPreferredName(request.getPreferredName());
        }
        profile.setOnboardingCompleted(true);
        userProfileRepository.save(profile);

        UserPreferences prefs = userPreferencesRepository.findById(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
        if (request.getInterests() != null) {
            prefs.setInterests(request.getInterests().toArray(new String[0]));
        }
        if (request.getDefaultGameDifficulty() != null) {
            prefs.setDefaultGameDifficulty(request.getDefaultGameDifficulty());
        }
        if (request.getPreferredSessionMinutes() != null) {
            prefs.setPreferredSessionMinutes(request.getPreferredSessionMinutes());
        }
        userPreferencesRepository.save(prefs);

        AccessibilitySettingsEntity access = accessibilitySettingsRepository.findById(userId)
                .orElseGet(() -> createDefaultAccessibility(userId));
        if (request.getThemePreset() != null) access.setThemePreset(request.getThemePreset());
        if (request.getFontFamily() != null) access.setFontFamily(request.getFontFamily());
        if (request.getFontSize() != null) access.setFontSize(request.getFontSize());
        if (request.getLineSpacing() != null) access.setLineSpacing(request.getLineSpacing());
        if (request.getReducedMotion() != null) access.setReducedMotion(request.getReducedMotion());
        if (request.getSoundEffectsEnabled() != null) access.setSoundEffectsEnabled(request.getSoundEffectsEnabled());
        accessibilitySettingsRepository.save(access);

        // Save selected goals
        if (request.getGoals() != null) {
            User user = userRepository.findById(userId).orElseThrow();
            for (String goalTitle : request.getGoals()) {
                UserGoal goal = new UserGoal(user, goalTitle, "LEARNING", 3);
                userGoalRepository.save(goal);
            }
        }

        return getProfile(userId);
    }

    @Transactional(readOnly = true)
    public DashboardOverviewDto getDashboardOverview(UUID userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        UserPreferences prefs = userPreferencesRepository.findById(userId)
                .orElseGet(() -> createDefaultPreferences(userId));

        DashboardOverviewDto dto = new DashboardOverviewDto();
        dto.setPreferredName(profile.getPreferredName());
        dto.setPresentationProfile(profile.getPresentationProfile());
        dto.setQuietMode(Boolean.TRUE.equals(prefs.getQuietModeEnabled()));

        LocalTime now = LocalTime.now();
        if (now.isBefore(LocalTime.NOON)) {
            dto.setGreeting("Good morning");
        } else if (now.isBefore(LocalTime.of(17, 0))) {
            dto.setGreeting("Good afternoon");
        } else {
            dto.setGreeting("Good evening");
        }

        dto.setQuote("Every mind is different. Technology should make room for those differences.");

        // Suggested activities
        List<Map<String, Object>> activities = new ArrayList<>();
        activities.add(Map.of("id", "act-1", "title", "Memory Garden", "category", "Memory & Recall", "icon", "Brain", "duration", "5m"));
        activities.add(Map.of("id", "act-2", "title", "Morning Focus Stretch", "category", "Daily Journey", "icon", "Sun", "duration", "3m"));
        activities.add(Map.of("id", "act-3", "title", "Exploring the Wonders of Water", "category", "Learning Corner", "icon", "BookOpen", "duration", "4m"));
        dto.setTodayActivities(activities);

        // Recommended games
        List<Map<String, Object>> recommended = new ArrayList<>();
        recommended.add(Map.of("id", "memory-garden", "title", "Memory Garden", "skills", "Working Memory", "tagline", "Match serene blossoms at your own pace", "icon", "Flower2"));
        recommended.add(Map.of("id", "focus-garden", "title", "Focus Garden", "skills", "Selective Attention", "tagline", "Discover hidden calm objects", "icon", "Eye"));
        recommended.add(Map.of("id", "word-builder", "title", "Word Builder", "skills", "Phonics & Language", "tagline", "Spelling stones and phonics exploration", "icon", "BookOpen"));
        dto.setRecommendedGames(recommended);

        // Active goals
        List<UserGoal> goals = userGoalRepository.findByUserIdAndStatus(userId, "ACTIVE");
        List<Map<String, Object>> goalList = new ArrayList<>();
        for (UserGoal g : goals) {
            goalList.add(Map.of("id", g.getId().toString(), "title", g.getTitle(), "progress", g.getCurrentCount(), "target", g.getTargetCount()));
        }
        dto.setActiveGoals(goalList);

        // Encouraging growth summary
        dto.setWeeklyGrowthSummary(Map.of(
                "sessionsCompleted", 4,
                "learningMinutes", 28,
                "encouragingNote", "You explored 4 gentle activities this week. Keep going at whatever pace feels right."
        ));

        return dto;
    }

    private UserProfile createDefaultProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        UserProfile profile = new UserProfile(user);
        return userProfileRepository.save(profile);
    }

    private UserPreferences createDefaultPreferences(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        UserPreferences prefs = new UserPreferences(user);
        prefs.setInterests(new String[]{"GAMES", "READING", "ROUTINES"});
        return userPreferencesRepository.save(prefs);
    }

    private AccessibilitySettingsEntity createDefaultAccessibility(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        AccessibilitySettingsEntity access = new AccessibilitySettingsEntity(user);
        return accessibilitySettingsRepository.save(access);
    }
}
