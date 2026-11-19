# NeuroNest — Master Tasks Checklist

## Phase 1: Project Foundation
- [x] Check system environment (Java 21, Maven, Node, Docker, Git)
- [x] Initialize Git repository and link to `https://github.com/vamsikiran1234/NeuroNest.git`
- [x] Create root `.gitignore`, `.env.example`, and `docker-compose.yml` (PostgreSQL 16)
- [x] Initialize Spring Boot 3.x backend with Maven (`pom.xml`, Java 21, Spring Web, Security, JPA, Validation, Flyway, PostgreSQL, Actuator)
- [x] Initialize React + TypeScript frontend with Vite, Tailwind CSS, dependencies
- [x] Verify frontend build and backend build
- [x] Commit & push Phase 1 to GitHub

## Phase 2: Design System & Accessibility Engine ("My Comfort")
- [x] Setup Tailwind CSS with custom palette (warm cream #F8F5EF, soft sage #B8CDBB, muted lavender #C8BCE0, dusty blue #AFC7D8, soft peach #E9BDA9, deep ink #303B3A, pale sand #EAE2D4, muted green #668A75)
- [x] Implement typography system (Nunito Sans, Atkinson Hyperlegible, OpenDyslexic font options)
- [x] Build global accessibility store with Zustand (font size, letter spacing, line height, contrast, theme, sound, reduced motion)
- [x] Build accessible UI primitives using Radix UI (dialogs, tooltips, switches, tabs, sliders, buttons, cards)
- [x] Create responsive navigation layout (Desktop sidebar, tablet collapsible, mobile bottom bar, header comfort shortcuts)
- [x] Verify accessibility compliance (WCAG contrast, focus indicators, keyboard navigation, reading ruler)
- [x] Commit & push Phase 2 to GitHub

## Phase 3: Authentication & User Management
- [x] Implement database schema with Flyway (users, roles, user_roles, refresh_tokens, audit_logs)
- [x] Spring Security configuration with JWT authentication and BCrypt
- [x] Auth endpoints: Register, Login, Refresh, Logout, Forgot Password, Reset Password
- [x] Role-Based Access Control (USER, PARENT_OR_GUARDIAN, ADMIN)
- [x] Frontend Auth state (Zustand + TanStack Query), login/register forms with React Hook Form + Zod
- [x] Route guards for protected, guardian, and admin routes
- [x] Commit & push Phase 3 to GitHub

## Phase 4: Personalization & Onboarding
- [ ] Database schema for user_profiles, user_preferences, accessibility_settings, user_goals
- [ ] Multi-step onboarding wizard (Presentation profiles: Young Explorers, Independent Learners, Everyday Companion)
- [ ] Interests selection, goals selection, sensory/accessibility setup
- [ ] User Profile and preferences backend API endpoints
- [ ] Personalized Home Dashboard ("My Space") with customizable activity cards, greeting, quiet mode
- [ ] Commit & push Phase 4 to GitHub

## Phase 5: Educational Game Hub & 8 Phaser 3 Playable Games
- [ ] Game database schema (games, game_categories, game_sessions, game_results, game_favorites)
- [ ] Backend game session verification API (start session, validate progress, complete session with verified scoring)
- [ ] Frontend Game Hub: category filtering, search, favorite toggles, difficulty indicators
- [ ] Core Reusable Game Engine (lifecycle: CREATED -> STARTED -> IN_PROGRESS -> PAUSED -> COMPLETED)
- [ ] Game 1: **Memory Garden** (Memory & Thinking - card matching, untimed options)
- [ ] Game 2: **Emotion Explorer** (Emotional Awareness - facial expressions & contextual scenarios)
- [ ] Game 3: **Word Builder** (Reading & Language - phonics & word formation, hints)
- [ ] Game 4: **Number Garden** (Numbers & Logic - counting, visual quantity comparison, arithmetic)
- [ ] Game 5: **Focus Garden** (Focus & Attention - selective attention, hidden patterns)
- [ ] Game 6: **Pattern Detective** (Memory & Thinking - sequence completion, logic puzzles)
- [ ] Game 7: **Story Builder** (Communication & Creativity - scene choices, narrative construction)
- [ ] Game 8: **Daily Life Simulator** (Everyday Life Skills - shopping, bag packing, schedule planning)
- [ ] Verify game session persistence and results in PostgreSQL
- [ ] Commit & push Phase 5 to GitHub

## Phase 6: Learning Corner & Daily Journey
- [ ] Learning Module database schema (learning_contents, saved_learning_contents, categories)
- [ ] Learning Corner UI (reading layouts, section-by-section breakdown, Web Speech API TTS & STT)
- [ ] Daily Journey database schema (routines, routine_steps, user_tasks, task_reminders)
- [ ] Routine & Task Management API (CRUD operations, reordering, step breakdown)
- [ ] Interactive task planner with visual timeline, daily checklist, positive reinforcement
- [ ] My Growth Progress Dashboard (Recharts visual summaries, streaks, non-competitive milestone cards)
- [ ] Commit & push Phase 6 to GitHub

## Phase 7: Spring AI Integration (Gemini)
- [ ] Spring AI configuration with Google Gemini (`ChatClient`, prompt templates, structured output DTOs)
- [ ] Text Simplification Service (multiple levels: simple, summary, step-by-step, vocabulary)
- [ ] Game Recommendation Service (based on preferences without diagnostic stereotyping)
- [ ] Routine Suggestion Service (break tasks into manageable steps)
- [ ] Story Builder AI generator with non-AI deterministic fallback templates
- [ ] Robust error handling, timeouts, rate limiting, and graceful offline fallback when API key is missing
- [ ] Frontend AI Assistant interface with user consent banner
- [ ] Commit & push Phase 7 to GitHub

## Phase 8: Guardian Support & Administration
- [ ] Guardian database schema (guardian_relationships, consent_records)
- [ ] Guardian portal (child account linking, consent management, activity summary review, goal setting)
- [ ] Child privacy safeguards (privacy controls, no raw conversation leakage)
- [ ] Admin dashboard (user management, game catalog management, content management, audit logs, health monitoring)
- [ ] Admin RBAC security enforcement
- [ ] Commit & push Phase 8 to GitHub

## Phase 9: Testing, Accessibility & Security Verification
- [ ] Backend unit & integration tests (JUnit 5, Mockito, Spring Security tests)
- [ ] Frontend unit tests with Vitest (components, stores, utility functions)
- [ ] End-to-end user journey tests with Playwright
- [ ] Accessibility audit (WCAG AA contrast, keyboard accessibility, ARIA attributes, reduced motion)
- [ ] Responsive design verification (desktop, tablet, mobile layouts)
- [ ] Fix any discovered defects or edge cases
- [ ] Commit & push Phase 9 to GitHub

## Phase 10: Documentation & Deployment
- [ ] Complete root `README.md` with system overview, architecture diagrams, setup guide
- [ ] Detailed documentation in `/docs`:
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE.md` (with ER diagram)
  - `docs/API.md` (OpenAPI / Swagger details)
  - `docs/AI_INTEGRATION.md`
  - `docs/GAME_ENGINE.md`
  - `docs/ACCESSIBILITY.md`
  - `docs/DEPLOYMENT.md`
- [ ] Multi-stage Dockerfiles (`frontend/Dockerfile`, `backend/Dockerfile`)
- [ ] Production-ready `docker-compose.yml`
- [ ] GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [ ] Final verification and push to GitHub repository
