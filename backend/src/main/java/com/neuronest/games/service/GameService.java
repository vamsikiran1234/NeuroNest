package com.neuronest.games.service;

import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.games.dto.*;
import com.neuronest.games.entity.*;
import com.neuronest.games.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepository;
    private final GameCategoryRepository gameCategoryRepository;
    private final GameSessionRepository gameSessionRepository;
    private final GameFavoriteRepository gameFavoriteRepository;
    private final GameAchievementRepository gameAchievementRepository;
    private final UserRepository userRepository;

    public GameService(
            GameRepository gameRepository,
            GameCategoryRepository gameCategoryRepository,
            GameSessionRepository gameSessionRepository,
            GameFavoriteRepository gameFavoriteRepository,
            GameAchievementRepository gameAchievementRepository,
            UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.gameCategoryRepository = gameCategoryRepository;
        this.gameSessionRepository = gameSessionRepository;
        this.gameFavoriteRepository = gameFavoriteRepository;
        this.gameAchievementRepository = gameAchievementRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<GameCategoryDto> getCategories() {
        return gameCategoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(c -> new GameCategoryDto(c.getId(), c.getName(), c.getDescription(), c.getIconName(), c.getDisplayOrder()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GameDto> getAllGames(UUID userId) {
        List<Game> games = gameRepository.findByActiveTrue();
        Set<String> favorites = userId != null
                ? gameFavoriteRepository.findByUserId(userId).stream()
                .map(GameFavorite::getGameId)
                .collect(Collectors.toSet())
                : Collections.emptySet();

        return games.stream()
                .map(g -> mapToDto(g, favorites.contains(g.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GameDto getGameById(String gameId, UUID userId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException("Game not found: " + gameId, HttpStatus.NOT_FOUND));

        boolean isFav = userId != null && gameFavoriteRepository.existsByUserIdAndGameId(userId, gameId);
        return mapToDto(game, isFav);
    }

    @Transactional
    public GameSessionDto createSession(UUID userId, String gameId, StartGameSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException("Game not found: " + gameId, HttpStatus.NOT_FOUND));

        GameSession session = new GameSession(user, game, request.getDifficulty());
        session.setStatus("STARTED");
        GameSession saved = gameSessionRepository.save(session);

        return mapToSessionDto(saved);
    }

    @Transactional
    public GameSessionDto completeSession(UUID userId, UUID sessionId, CompleteGameSessionRequest request) {
        GameSession session = gameSessionRepository.findById(sessionId)
                .orElseThrow(() -> new AppException("Game session not found", HttpStatus.NOT_FOUND));

        if (!session.getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized session access", HttpStatus.FORBIDDEN);
        }

        // Validate session inputs: attempts must be >= correctCount
        int attempts = Math.max(request.getAttempts(), request.getCorrectCount());
        session.setAttempts(attempts);
        session.setCorrectCount(request.getCorrectCount());
        session.setIncorrectCount(Math.max(0, request.getIncorrectCount()));
        session.setDurationSeconds(Math.max(1, request.getDurationSeconds()));
        session.setScore(Math.max(0, request.getScore()));
        session.setStatus("COMPLETED");
        session.setCompletedAt(Instant.now());
        session.setFeedbackNotes(request.getFeedbackNotes());

        GameSession completed = gameSessionRepository.save(session);

        // Check and award positive achievements
        checkAndAwardAchievements(session.getUser(), session.getGame());

        return mapToSessionDto(completed);
    }

    @Transactional(readOnly = true)
    public List<GameSessionDto> getUserGameHistory(UUID userId) {
        return gameSessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::mapToSessionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleFavorite(UUID userId, String gameId) {
        if (!gameRepository.existsById(gameId)) {
            throw new AppException("Game not found", HttpStatus.NOT_FOUND);
        }

        if (gameFavoriteRepository.existsByUserIdAndGameId(userId, gameId)) {
            gameFavoriteRepository.deleteByUserIdAndGameId(userId, gameId);
            return false;
        } else {
            gameFavoriteRepository.save(new GameFavorite(userId, gameId));
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<GameAchievementDto> getUserAchievements(UUID userId) {
        return gameAchievementRepository.findByUserIdOrderByEarnedAtDesc(userId).stream()
                .map(a -> new GameAchievementDto(a.getId(), a.getBadgeKey(), a.getTitle(), a.getDescription(), a.getIconName(), a.getEarnedAt()))
                .collect(Collectors.toList());
    }

    private void checkAndAwardAchievements(User user, Game game) {
        String firstGameBadge = "FIRST_GAME_EXPLORED";
        if (!gameAchievementRepository.existsByUserIdAndBadgeKey(user.getId(), firstGameBadge)) {
            gameAchievementRepository.save(new GameAchievement(
                    user,
                    firstGameBadge,
                    "Curious Explorer",
                    "Completed your first game activity in NeuroNest!",
                    "Sparkles"
            ));
        }

        long completedSessions = gameSessionRepository.countByUserIdAndStatus(user.getId(), "COMPLETED");
        if (completedSessions >= 5) {
            String dedicatedBadge = "FIVE_GAMES_COMPLETED";
            if (!gameAchievementRepository.existsByUserIdAndBadgeKey(user.getId(), dedicatedBadge)) {
                gameAchievementRepository.save(new GameAchievement(
                        user,
                        dedicatedBadge,
                        "Steady Journey",
                        "Completed 5 engaging learning sessions at your own pace.",
                        "Award"
                ));
            }
        }
    }

    private GameDto mapToDto(Game g, boolean favorite) {
        GameDto dto = new GameDto();
        dto.setId(g.getId());
        dto.setCategoryId(g.getCategory().getId());
        dto.setCategoryName(g.getCategory().getName());
        dto.setTitle(g.getTitle());
        dto.setTagline(g.getTagline());
        dto.setDescription(g.getDescription());
        dto.setInstructions(g.getInstructions());
        dto.setSkillsPracticed(g.getSkillsPracticed() != null ? Arrays.asList(g.getSkillsPracticed()) : Collections.emptyList());
        dto.setEstimatedMinutes(g.getEstimatedMinutes());
        dto.setSupportedDifficulties(g.getSupportedDifficulties() != null ? Arrays.asList(g.getSupportedDifficulties()) : Collections.emptyList());
        dto.setThumbnailUrl(g.getThumbnailUrl());
        dto.setFavorite(favorite);
        return dto;
    }

    private GameSessionDto mapToSessionDto(GameSession s) {
        GameSessionDto dto = new GameSessionDto();
        dto.setId(s.getId());
        dto.setGameId(s.getGame().getId());
        dto.setGameTitle(s.getGame().getTitle());
        dto.setDifficulty(s.getDifficulty());
        dto.setStatus(s.getStatus());
        dto.setStartedAt(s.getStartedAt());
        dto.setCompletedAt(s.getCompletedAt());
        dto.setDurationSeconds(s.getDurationSeconds());
        dto.setAttempts(s.getAttempts());
        dto.setCorrectCount(s.getCorrectCount());
        dto.setIncorrectCount(s.getIncorrectCount());
        dto.setScore(s.getScore());
        dto.setFeedbackNotes(s.getFeedbackNotes());
        return dto;
    }
}
