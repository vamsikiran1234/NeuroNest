package com.neuronest.ai.service;

import com.neuronest.ai.dto.*;
import com.neuronest.ai.entity.AiInteractionMetadata;
import com.neuronest.ai.repository.AiInteractionMetadataRepository;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AiService {

    private final GeminiApiClient geminiApiClient;
    private final AiInteractionMetadataRepository metadataRepository;
    private final UserRepository userRepository;

    public AiService(
            GeminiApiClient geminiApiClient,
            AiInteractionMetadataRepository metadataRepository,
            UserRepository userRepository
    ) {
        this.geminiApiClient = geminiApiClient;
        this.metadataRepository = metadataRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SimplifyTextResponse simplifyText(UUID userId, SimplifyTextRequest request) {
        long start = System.currentTimeMillis();
        String systemInstruction = "You are NeuroNest's gentle text simplifier. " +
                "Rewrite the provided text so it is easy to read, calm, and clear for individuals with dyslexia, ADHD, or cognitive fatigue. " +
                "Break into short sentences and clear bullet points. Avoid patronizing tone. Never give medical diagnoses.";

        Optional<String> geminiOutput = geminiApiClient.generateText(systemInstruction, request.getText());
        int latency = (int) (System.currentTimeMillis() - start);

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        if (user != null) {
            metadataRepository.save(new AiInteractionMetadata(
                    user, "SIMPLIFY", geminiOutput.isPresent() ? "gemini" : "deterministic-fallback", 120, latency, true
            ));
        }

        if (geminiOutput.isPresent()) {
            return new SimplifyTextResponse(
                    geminiOutput.get(),
                    List.of("Clear simplified explanation generated with AI support", "Key ideas highlighted for accessible reading"),
                    List.of(new SimplifyTextResponse.VocabularyItem("Overview", "A quick clear look at the main ideas.")),
                    false
            );
        }

        // Deterministic high-quality fallback
        String fallbackSimplified = generateFallbackSimplification(request.getText());
        return new SimplifyTextResponse(
                fallbackSimplified,
                List.of(
                        "Broken down into short, gentle sentences",
                        "Focused on the core concepts without overwhelming extra clutter",
                        "Highlighted key ideas for comfortable reading"
                ),
                List.of(
                        new SimplifyTextResponse.VocabularyItem("Core Idea", "The main point being explained."),
                        new SimplifyTextResponse.VocabularyItem("Context", "The setting and background information.")
                ),
                true
        );
    }

    @Transactional
    public TaskBreakdownResponse breakdownTask(UUID userId, TaskBreakdownRequest request) {
        long start = System.currentTimeMillis();
        String systemInstruction = "You are an executive function coach for NeuroNest. " +
                "Given a task that feels big or overwhelming, break it down into 3 to 4 micro-steps. " +
                "Each micro-step should be concrete, take 2 to 10 minutes, and have a calm encouraging detail. " +
                "Format clearly with step numbers.";

        Optional<String> geminiOutput = geminiApiClient.generateText(systemInstruction, request.getTaskTitle());
        int latency = (int) (System.currentTimeMillis() - start);

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        if (user != null) {
            metadataRepository.save(new AiInteractionMetadata(
                    user, "BREAKDOWN", geminiOutput.isPresent() ? "gemini" : "deterministic-fallback", 150, latency, true
            ));
        }

        // Deterministic fallback steps tailored by keyword
        List<TaskBreakdownResponse.MicroStep> steps = generateFallbackTaskSteps(request.getTaskTitle());
        String advice = "Take a gentle breath before beginning. Remember you only need to focus on Step 1 right now; the rest can wait.";

        return new TaskBreakdownResponse(
                request.getTaskTitle(),
                geminiOutput.orElse(advice),
                steps,
                geminiOutput.isEmpty()
        );
    }

    @Transactional
    public GameRecommendationResponse recommendGames(UUID userId, GameRecommendationRequest request) {
        long start = System.currentTimeMillis();
        int latency = (int) (System.currentTimeMillis() - start);

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        if (user != null) {
            metadataRepository.save(new AiInteractionMetadata(
                    user, "RECOMMEND", "deterministic-engine", 40, latency, true
            ));
        }

        String mood = request.getCurrentMood() != null ? request.getCurrentMood().toUpperCase() : "NEED_CALM";
        List<GameRecommendationResponse.RecommendedGameItem> items = new ArrayList<>();
        String friendlyMessage;

        switch (mood) {
            case "NEED_FOCUS":
                friendlyMessage = "Here are two calming activities that gently exercise selective visual focus without any time pressure:";
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "focus-garden", "Focus Garden", "Helps train selective visual attention by finding serene items in nature scenes.", "Focus & Attention"
                ));
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "pattern-detective", "Pattern Detective", "Engaging deductive puzzles with friendly pattern rhythms.", "Numbers & Logic"
                ));
                break;
            case "FEELING_CREATIVE":
                friendlyMessage = "Wonderful creative energy! Here are activities where you can express ideas and craft narratives:";
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "story-builder", "Story Builder", "Design your own heartwarming story and listen to it read aloud smoothly.", "Communication"
                ));
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "word-builder", "Word Builder", "Piece together phonetic letters with helpful dyslexia-friendly visual cues.", "Language"
                ));
                break;
            case "LIFE_PRACTICE":
                friendlyMessage = "Practical everyday activities to build confident daily independence:";
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "daily-life-simulator", "Daily Life Simulator", "Practice packing an adventure bag and calm neighborhood grocery budgeting.", "Life Skills"
                ));
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "emotion-explorer", "Emotion Explorer", "Explore social scenarios and supportive coping choices in a safe space.", "Emotions"
                ));
                break;
            case "NEED_CALM":
            default:
                friendlyMessage = "When feelings or sensory inputs feel full, these peaceful, unhurried activities offer gentle comfort:";
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "memory-garden", "Memory Garden", "Completely untimed card pairs with soothing nature chimes.", "Memory & Thinking"
                ));
                items.add(new GameRecommendationResponse.RecommendedGameItem(
                        "number-garden", "Number Garden", "Gentle visual counting with cheerful butterflies and garden blossoms.", "Numbers & Logic"
                ));
                break;
        }

        return new GameRecommendationResponse(friendlyMessage, items, true);
    }

    @Transactional
    public AiAskResponse askAssistant(UUID userId, AiAskRequest request) {
        long start = System.currentTimeMillis();
        String systemInstruction = "You are NeuroNest's AI Learning Guide. " +
                "You provide clear, friendly, encouraging educational answers for neurodiverse individuals. " +
                "Keep sentences calm and digestible. Never claim to diagnose, cure, or assess mental health conditions. " +
                "Always end with a supportive takeaway.";

        Optional<String> geminiOutput = geminiApiClient.generateText(systemInstruction, request.getPrompt());
        int latency = (int) (System.currentTimeMillis() - start);

        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        if (user != null) {
            metadataRepository.save(new AiInteractionMetadata(
                    user, "ASK", geminiOutput.isPresent() ? "gemini" : "deterministic-fallback", 180, latency, true
            ));
        }

        if (geminiOutput.isPresent()) {
            return new AiAskResponse(
                    geminiOutput.get(),
                    "Remember that learning at your own natural pace is a wonderful strength.",
                    false
            );
        }

        // Fallback explanation
        String prompt = request.getPrompt().toLowerCase();
        String fallbackAnswer;
        if (prompt.contains("adhd") || prompt.contains("focus")) {
            fallbackAnswer = "Focus naturally moves in waves! In NeuroNest, you can try setting small 5-minute checkpoints, keeping sensory inputs calm in My Comfort, or playing Focus Garden.";
        } else if (prompt.contains("dyslexia") || prompt.contains("read")) {
            fallbackAnswer = "Reading is smoother when your eyes are comfortable. Try enabling the OpenDyslexic font and the Reading Ruler in My Comfort, or use the 'Read to Me' audio button in the Learning Corner!";
        } else {
            fallbackAnswer = "That is a wonderful question! Learning happens best when information is presented in chunks you can explore step by step without rush or pressure.";
        }

        return new AiAskResponse(
                fallbackAnswer,
                "Every mind explores differently, and every step forward is meaningful.",
                true
        );
    }

    private String generateFallbackSimplification(String raw) {
        String clean = raw.trim();
        String[] sentences = clean.split("[.!?]");
        StringBuilder sb = new StringBuilder();
        sb.append("Here is the simplified summary:\n\n");
        int count = 0;
        for (String s : sentences) {
            String trimmed = s.trim();
            if (trimmed.length() > 5) {
                sb.append("• ").append(trimmed).append(".\n");
                count++;
                if (count >= 4) break;
            }
        }
        if (count == 0) {
            sb.append("• ").append(clean).append("\n");
        }
        return sb.toString();
    }

    private List<TaskBreakdownResponse.MicroStep> generateFallbackTaskSteps(String title) {
        String lower = title.toLowerCase();
        List<TaskBreakdownResponse.MicroStep> steps = new ArrayList<>();

        if (lower.contains("clean") || lower.contains("room") || lower.contains("desk")) {
            steps.add(new TaskBreakdownResponse.MicroStep(1, "Put away 3 items on the floor", "Pick just three items and place them where they belong.", 3));
            steps.add(new TaskBreakdownResponse.MicroStep(2, "Clear trash or empty cups", "Toss any food wrappers or empty glasses in the bin.", 2));
            steps.add(new TaskBreakdownResponse.MicroStep(3, "Straighten the main surface", "Make bed or stack notebooks neatly on your desk.", 5));
            steps.add(new TaskBreakdownResponse.MicroStep(4, "Pause and celebrate", "Notice the open space and take a deep breath.", 1));
        } else if (lower.contains("study") || lower.contains("homework") || lower.contains("read")) {
            steps.add(new TaskBreakdownResponse.MicroStep(1, "Gather materials & open page", "Get your book, notebook, and pen in place.", 2));
            steps.add(new TaskBreakdownResponse.MicroStep(2, "Read first section or solve 2 problems", "Focus only on the first small part, ignore the rest.", 10));
            steps.add(new TaskBreakdownResponse.MicroStep(3, "Take a 2-minute stretch break", "Stand up, stretch arms, and sip water.", 2));
            steps.add(new TaskBreakdownResponse.MicroStep(4, "Review your work gently", "Check that your name and answers are tidy.", 5));
        } else {
            steps.add(new TaskBreakdownResponse.MicroStep(1, "Prepare the starting space", "Clear off unnecessary items so your mind feels calm.", 3));
            steps.add(new TaskBreakdownResponse.MicroStep(2, "Do the very first step", "Complete only the first 5 minutes of the activity.", 5));
            steps.add(new TaskBreakdownResponse.MicroStep(3, "Check in with how you feel", "Pause and see if you want to continue or take a brief break.", 2));
            steps.add(new TaskBreakdownResponse.MicroStep(4, "Wrap up neatly", "Put your tools away and celebrate your focus.", 2));
        }

        return steps;
    }
}
