# NeuroNest — Spring AI & GenAI Integration Architecture

This document details the architectural design, safety boundaries, prompt templates, and deterministic fallback mechanics of the Artificial Intelligence layer within **NeuroNest**.

---

## 1. Architectural Overview

NeuroNest connects cognitive neurodiversity principles with modern generative AI through a disciplined, layered architecture:

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + TS)                 │
│      - AI Assistant Hub (/ai-assistant)                │
│      - Sensory Companion & Text Simplifier View        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (JWT Auth)
┌───────────────────────────▼────────────────────────────┐
│         Spring Boot Backend REST Controllers           │
│             `AiController.java` (/api/v1/ai)           │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    AiService.java                      │
│      - High-level business orchestration               │
│      - Telemetry & Audit Logging (No PII)              │
│      - Structured DTO mapping                          │
└──────────────┬───────────────────────────┬─────────────┘
               │ (API Key Configured)      │ (No Key / Network Failure)
┌──────────────▼─────────────┐ ┌───────────▼─────────────┐
│    GeminiApiClient.java    │ │ Deterministic Fallback  │
│  - Spring RestClient       │ │  Heuristics Engine      │
│  - Gemini 1.5 Flash API    │ │  - NLP Sentence Parsing │
│  - 10-Second Timeout       │ │  - Executive Sub-tasks  │
│  - System Prompt Controls  │ │  - Mood-to-Game Matrix  │
└────────────────────────────┘ └─────────────────────────┘
```

---

## 2. Ethical Guarantees & Safeguards

NeuroNest enforces strict boundaries regarding artificial intelligence:

1. **Non-Diagnostic Policy**:
   The AI service never claims to diagnose, treat, or cure any neurological condition (ASD, ADHD, Dyslexia, etc.).
2. **Deterministic Essential Availability**:
   All core platform features (all 8 games, routines, learning library, progress tracking, accessibility customization) operate 100% offline without requiring any AI provider API key.
3. **Child & User Privacy Shield**:
   Raw personal reflections, journal entries, and free-form messages are **never** logged to the database or telemetry. The `AiInteractionMetadata` model records solely:
   - Action type (`SIMPLIFICATION`, `TASK_BREAKDOWN`, `GAME_RECOMMENDATION`, `GENERAL_QUERY`)
   - Latency in milliseconds
   - Estimated token consumption
   - Boolean success/fallback flag

---

## 3. Spring AI & Gemini API Configuration

Configuration parameters are declared in `application.yml` and overridable via environment variables:

```yaml
neuronest:
  ai:
    gemini:
      api-key: ${GEMINI_API_KEY:}
      model: ${AI_MODEL:gemini-1.5-flash}
      endpoint-url: https://generativelanguage.googleapis.com/v1beta/models
      temperature: ${AI_TEMPERATURE:0.7}
      max-output-tokens: ${AI_MAX_TOKENS:800}
      timeout-seconds: ${AI_TIMEOUT_SECONDS:10}
```

### Supported Actions & Endpoints

| Endpoint | Action | Primary Target Profile | Description |
|---|---|---|---|
| `POST /api/v1/ai/simplify` | Text Simplification | Dyslexia, ASD, Cognitive Load | Rewrites complex texts into short, active sentences with bulleted summaries. |
| `POST /api/v1/ai/breakdown-task` | Executive Function Breakdown | ADHD, Executive Dysfunction | Converts overwhelming tasks into 3–4 manageable micro-steps. |
| `POST /api/v1/ai/recommend-games` | Sensory & Mood Game Recommender | ASD, ADHD, Sensory Needs | Matches user energy level and sensory tolerance to suitable calming games. |
| `POST /api/v1/ai/ask` | Supportive Assistant Q&A | All Users | Provides gentle, constructive answers regarding routines, focus, and organization. |

---

## 4. Prompt Engineering & System Prompts

Each AI operation is wrapped in a structured system prompt designed for cognitive accessibility:

### 4.1 Text Simplification System Prompt
```text
You are NeuroNest's friendly, supportive reading assistant.
Your goal is to make text accessible for people with dyslexia, ADHD, or cognitive load challenges:
1. Use clear, everyday vocabulary and short sentences.
2. Structure information with bullet points.
3. Keep the emotional tone supportive, calm, and respectful.
4. Highlight 2-3 key takeaway concepts.
5. NEVER provide medical or diagnostic advice.
```

### 4.2 Executive Task Breakdown System Prompt
```text
You are an executive function coach for individuals with ADHD and neurodivergence.
Break down the requested task into 3 to 5 realistic micro-steps:
1. Each step must have a clear physical action.
2. Include an estimated duration in minutes for each step.
3. Suggest a brief sensory or focus tip.
4. Output valid JSON formatted with: steps (title, detail, estimatedMinutes, sensoryTip).
```

---

## 5. Resilient Deterministic Fallback Engine

When `GEMINI_API_KEY` is omitted, revoked, or when external API rate-limiting occurs, the backend transitions to deterministic fallback routines:

- **Text Simplification**: Parses sentences with regex delimiters, extracts leading declarative thoughts, formats into bulleted lists with estimated reading times.
- **Task Breakdown**: Identifies common patterns (e.g., "clean room", "study", "homework", "morning routine") and returns structured micro-steps with time estimates and sensory breaks.
- **Game Recommendation**: Maps user-selected moods (e.g., `"Overwhelmed"`, `"Energetic"`, `"Restless"`, `"Curious"`) against the 8 NeuroNest educational games based on sensory intensity, working memory demand, and executive load.
- **Supportive Q&A**: Employs an empathetic template engine emphasizing self-compassion, pacing, and breaks.

This ensures zero platform downtime and provides reliable testing in offline environments.
