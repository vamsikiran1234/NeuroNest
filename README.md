# NeuroNest 🌿

> **"A space where every mind finds its way."**

[![Java](https://img.shields.io/badge/Java-21%20LTS-007396?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-00A86B)](#accessibility)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**NeuroNest** is an accessible, AI-augmented digital learning and daily organization platform designed specifically for individuals with diverse cognitive profiles, including **Autism Spectrum Disorder (ASD)**, **ADHD**, **Dyslexia**, **Dyscalculia**, and unique sensory preferences.

Rather than forcing neurodivergent minds to adapt to rigid technology, NeuroNest dynamically adapts to the user — combining calm visual environments, sensory customization, executive-function support, and non-punitive educational games.

---

## 🌟 Core Pillars & Guarantees

1. **Non-Diagnostic & Supportive**: NeuroNest never attempts to diagnose, treat, or cure any neurological condition. It is an educational and supportive companion.
2. **Zero Essential AI Dependency**: Every game, daily routine, learning article, progress metric, and accessibility setting functions **100% offline** without requiring an external AI API key.
3. **Non-Punitive Game Architecture**: No countdown timers, no penalty buzzers, no lives lost, and zero failure screens. Every interaction celebrates exploration and effort.
4. **Child Privacy Shield**: Guardians can monitor engagement milestones and manage consent, but personal journals and raw thought transcripts are strictly private to the user.

---

## 🚀 Key Modules & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NEURONEST PLATFORM                            │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 🎮 Educational Hub │ 📖 Learning Corner │ 🧘 Daily Journey & Routines  │
│ 8 Playable Games   │ Chunked Reading    │ Sensory Routines & Steps     │
│ Web Audio Synth    │ Simplified Modes   │ Positive Sound Chimes        │
│ Non-Punitive Play  │ Web Speech TTS     │ Zero Blank States            │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ 🛡️ "My Comfort"    │ 🤖 Spring AI Hub   │ 📊 Growth & Guardian Support │
│ 6 Sensory Palettes │ Gemini 1.5 Flash   │ Non-Competitive Radars       │
│ OpenDyslexic / Lex │ Deterministic Mode │ Milestone Celebrations       │
│ Reading Ruler      │ Task Micro-Steps   │ Consent & Privacy Controls   │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

### 1. "My Comfort" Accessibility Engine
- **6 Sensory Color Palettes**: Default Ocean, Forest Calm (stress-reducing sage), Sunset Warmth (low blue-light), Lavender Dream, High Contrast Dark, and High Contrast Light.
- **Specialized Typography**: Real-time switching between **Atkinson Hyperlegible** (distinguishable letterforms), **OpenDyslexic** (weighted bottoms combating rotation), **Lexend** (reduced visual crowding), and System Sans.
- **Interactive Reading Ruler**: Draggable, customizable reading band that dims outer text to assist line-tracking for ADHD and Dyslexia.
- **Sensory Quiet Mode**: Strips decorative visual elements and animations to prevent sensory overstimulation.

### 2. 8 Educational Games (Built-in Web Audio Synthesis)
All games feature instant, zero-latency synthesizer audio built directly with the browser's **Web Audio API** (`sine` and `triangle` harmonic chimes):
1. **Memory Garden**: Working memory and visual recall through peaceful botanical cards.
2. **Emotion Explorer**: Socio-emotional nuance recognition and positive coping strategies.
3. **Word Builder**: Phonics and spelling with OpenDyslexic tiles and speech synthesis.
4. **Number Garden**: Dyscalculia mitigation through ten-frame dot arrays and visual comparisons.
5. **Focus Garden**: Selective visual attention and peaceful item spotting for ADHD.
6. **Pattern Detective**: Predictable sequential logic and deduction puzzles.
7. **Story Builder**: Interactive branching stories with Web Speech API audio narration.
8. **Daily Life Simulator**: Executive function rehearsal (bag packing, morning routines).

### 3. Learning Corner
- Dual presentation mode: **Standard Article Mode** vs. **Simplified Mode** (short sentences, key takeaways, and bulleted concepts).
- Client-side **Text-to-Speech (TTS)** with variable speed controls (0.7x – 1.2x).
- Built-in vocabulary cards and instant bookmarking.

### 4. Daily Journey & Routines
- Structured morning, afternoon, evening, and sensory decompression routines.
- Step-by-step checklists with celebratory chimes upon completion.
- Built-in auto-seeding ensures users are never greeted by an empty, overwhelming blank state.

### 5. My Growth Dashboard
- Non-competitive progress tracking powered by **Recharts**.
- Weekly Mindful Engagement BarCharts and Multi-Dimensional Skills Radar.
- Celebrated milestone badges reinforcing intrinsic motivation.

### 6. Spring AI & Gemini 1.5 Assistant
- **Accessible Text Simplifier**: Rewrites complex text into digestible reading chunks.
- **Executive Task Breakdown**: Breaks overwhelming tasks into 3–4 achievable micro-steps with time estimates.
- **Sensory Game Recommender**: Matches games based on current energy and sensory levels.
- **Deterministic Offline Fallbacks**: Seamless heuristics engine guarantees instant responses if the Gemini API is offline or unconfigured.

### 7. Guardian Portal & Administration
- Account linking for parents and educators.
- Explicit toggle controls for minor account creation, telemetry storage, and AI assistance.
- Executive summary metrics without compromising personal reflections.
- Real-time administrative telemetry, user directories, and security audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite 5 | Reactive, type-safe single-page interface |
| **Styling** | Tailwind CSS, Custom CSS Variables | Responsive design system & accessible themes |
| **Primitives** | Radix UI, Motion | Accessible dialogs, drawers, and controlled motion |
| **State & Cache** | Zustand, TanStack Query | Sensory persistence and resilient server synchronization |
| **Data Viz** | Recharts | Non-competitive growth and mindfulness charts |
| **Sound** | HTML5 Web Audio API | Client-side pure tone oscillator synthesis |
| **Speech** | Web Speech API | Client-side text-to-speech engine |
| **Backend** | Java 21 LTS, Spring Boot 3.3.5 | Enterprise REST API and business logic |
| **Security** | Spring Security, JJWT | Stateless JWT authentication with rotating refresh tokens |
| **AI Layer** | Spring AI, Google Gemini API | Structured generative AI with deterministic fallbacks |
| **Database** | PostgreSQL 16, Flyway | Relational persistence and versioned schema migrations |
| **DevOps** | Docker, Docker Compose, Nginx | Multi-stage containerization and reverse proxy routing |

---

## 📦 Quick Start with Docker

The fastest way to launch the complete NeuroNest stack is via Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/vamsikiran1234/NeuroNest.git
cd NeuroNest

# 2. Configure environment (optional Gemini API key)
cp .env.example .env

# 3. Launch the containerized application
docker-compose up -d --build
```

Access the services:
- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Actuator Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

## 💻 Local Development Setup

### Prerequisites
- **Java 21 LTS**
- **Node.js 20+**
- **PostgreSQL 16** (or use H2 dev profile)

### 1. Backend Development
```bash
cd backend
./mvnw clean test
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 2. Frontend Development
```bash
cd frontend
npm install
npm test -- --run
npm run dev
```
*Frontend runs on `http://localhost:5173` with proxying to backend.*

---

## 📚 Comprehensive Documentation

Detailed architectural and technical guides are available in the [`docs/`](./docs) directory:

- [System Architecture](file:///docs/ARCHITECTURE.md) — Modular monolith structure, data flows, and component relationships.
- [Database & Schema](file:///docs/DATABASE.md) — PostgreSQL data model, Flyway migrations, and ER diagrams.
- [REST API Specification](file:///docs/API.md) — Envelopes, security headers, and complete endpoint documentation.
- [Spring AI & GenAI Integration](file:///docs/AI_INTEGRATION.md) — Gemini client, prompt templates, and deterministic offline fallbacks.
- [Educational Game Engine](file:///docs/GAME_ENGINE.md) — 8 games, Web Audio API synthesis, and non-punitive mechanics.
- [Accessibility & WCAG 2.1 AA](file:///docs/ACCESSIBILITY.md) — Sensory palettes, typography, reading ruler, and quiet mode.
- [Production Deployment](file:///docs/DEPLOYMENT.md) — Docker Compose, security hardening, and health monitoring.

---

## 🧪 Testing & Verification

NeuroNest maintains automated test coverage across frontend and backend modules:

- **Backend Unit Tests**: 16 JUnit 5 tests covering authentication, game sessions, learning modules, routines, guardian links, and AI fallback services.
- **Frontend Unit Tests**: 16 Vitest tests validating accessibility persistence, game registry integrity, AI assistant flows, and auth tokens.
- **Type Safety**: Clean TypeScript compilation with zero errors across the entire codebase.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
