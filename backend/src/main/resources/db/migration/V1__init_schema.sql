-- =============================================================================
-- NeuroNest V1 Database Schema Migration
-- Designed for PostgreSQL 16+
-- =============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. AUTHENTICATION & USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Seed basic roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_USER', 'Standard platform learner/user'),
    ('ROLE_PARENT_OR_GUARDIAN', 'Parent or guardian managing linked accounts'),
    ('ROLE_ADMIN', 'Platform administrator')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    account_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, PENDING_VERIFICATION
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_minor BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. USER PROFILES, PREFERENCES & ACCESSIBILITY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio VARCHAR(500),
    avatar_id VARCHAR(50) DEFAULT 'owl-calm',
    preferred_name VARCHAR(100),
    presentation_profile VARCHAR(50) NOT NULL DEFAULT 'INDEPENDENT_LEARNERS', -- YOUNG_EXPLORERS, INDEPENDENT_LEARNERS, EVERYDAY_COMPANION
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    interests TEXT[] DEFAULT '{}', -- e.g. ['GAMES', 'READING', 'PUZZLES', 'DRAWING', 'NUMBERS']
    game_categories_preferred TEXT[] DEFAULT '{}',
    default_game_difficulty VARCHAR(50) DEFAULT 'BEGINNER',
    preferred_session_minutes INT DEFAULT 15,
    instruction_mode VARCHAR(50) DEFAULT 'TEXT_AND_AUDIO', -- TEXT, AUDIO, COMBINED
    quiet_mode_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accessibility_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    font_family VARCHAR(50) NOT NULL DEFAULT 'ATKINSON', -- NUNITO, ATKINSON, OPENDYSLEXIC, SYSTEM
    font_size VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- SMALL, MEDIUM, LARGE, EXTRA_LARGE
    line_spacing VARCHAR(20) NOT NULL DEFAULT 'RELAXED', -- NORMAL, RELAXED, LOOSE
    letter_spacing VARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- NORMAL, WIDE, WIDER
    theme_preset VARCHAR(50) NOT NULL DEFAULT 'WARM_CREAM', -- WARM_CREAM, SOFT_SAGE, MUTED_LAVENDER, DUSTY_BLUE, HIGH_CONTRAST, DARK
    contrast_mode VARCHAR(20) NOT NULL DEFAULT 'STANDARD', -- STANDARD, HIGH
    animations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
    sound_effects_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sound_volume INT NOT NULL DEFAULT 70,
    reading_ruler_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    simplified_navigation BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- FOCUS, READING, ROUTINES, COMMUNICATION, PROBLEM_SOLVING, LIFE_SKILLS
    target_count INT DEFAULT 1,
    current_count INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, ARCHIVED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. GUARDIAN MANAGEMENT & CONSENT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guardian_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dependent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL DEFAULT 'PARENT', -- PARENT, GUARDIAN, EDUCATOR
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REVOKED
    can_view_activity_summary BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_goals BOOLEAN NOT NULL DEFAULT TRUE,
    can_configure_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_guardian_dependent UNIQUE (guardian_id, dependent_id)
);

CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES users(id) ON DELETE SET NULL,
    consent_type VARCHAR(100) NOT NULL, -- MINOR_ACCOUNT_CREATION, DATA_STORAGE, AI_ASSISTANCE
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. GAMES & INTERACTIVE SKILL BUILDING
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Gamepad2',
    display_order INT DEFAULT 0
);

INSERT INTO game_categories (id, name, description, icon_name, display_order) VALUES
    ('FOCUS_ATTENTION', 'Focus & Attention', 'Activities that practice selective focus and sustaining attention in a calm space', 'Target', 1),
    ('MEMORY_THINKING', 'Memory & Thinking', 'Activities to exercise working memory, recall, and cognitive flexibility', 'Brain', 2),
    ('COMMUNICATION', 'Communication', 'Playful scenarios to explore expressive communication and story sharing', 'MessageCircle', 3),
    ('EMOTIONAL_AWARENESS', 'Emotional Awareness', 'Exploring feelings, contextual cues, and varied emotional perspectives', 'Heart', 4),
    ('READING_LANGUAGE', 'Reading & Language', 'Word building, phonics recognition, and engaging reading practice', 'BookOpen', 5),
    ('NUMBERS_LOGIC', 'Numbers & Logic', 'Visual counting, quantity comparison, and gentle logic exploration', 'Calculator', 6),
    ('EVERYDAY_LIFE', 'Everyday Life Skills', 'Practical daily scenarios like schedule planning, bag packing, and shopping', 'Compass', 7)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES game_categories(id),
    title VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    skills_practiced TEXT[] DEFAULT '{}',
    estimated_minutes INT DEFAULT 5,
    supported_difficulties TEXT[] DEFAULT '{"BEGINNER","INTERMEDIATE","ADVANCED"}',
    thumbnail_url VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO games (id, category_id, title, tagline, description, instructions, skills_practiced, estimated_minutes) VALUES
    ('memory-garden', 'MEMORY_THINKING', 'Memory Garden', 'Match serene garden pairs at your own pace', 'Uncover hidden blossoms and find matching pairs in a peaceful garden setting without time pressure.', 'Click or tap any two cards to reveal them. If they match, they stay blooming! If not, take your time to remember where they were.', '{"Working Memory", "Visual Recall", "Pattern Recognition"}', 5),
    ('emotion-explorer', 'EMOTIONAL_AWARENESS', 'Emotion Explorer', 'Discover nuanced feelings and story context', 'Explore illustrated facial expressions and social scenes with encouraging, neutral guidance.', 'Look at the scene and emotional expressions. Choose which feeling best fits the character, understanding there are many ways people experience feelings.', '{"Empathy", "Social Cues", "Perspective Taking"}', 6),
    ('word-builder', 'READING_LANGUAGE', 'Word Builder', 'Form words with letter stepping stones', 'Arrange syllables and phonics blocks to spell friendly words with optional audio and hints.', 'Drag or select letter blocks into the target slots to complete words. Listen to pronunciation whenever you want.', '{"Phonics", "Spelling", "Vocabulary"}', 5),
    ('number-garden', 'NUMBERS_LOGIC', 'Number Garden', 'Count, compare, and nourish numbers', 'Engage in visual quantity comparisons, interactive counting, and gentle arithmetic puzzles.', 'Count the glowing butterflies and ripe fruit. Match quantities and find the right garden baskets.', '{"Number Sense", "Visual Counting", "Quantity Comparison"}', 5),
    ('focus-garden', 'FOCUS_ATTENTION', 'Focus Garden', 'Find subtle wonders in a calm visual space', 'Practice selective visual attention by finding specific friendly critters and calm objects.', 'Scan the scene to find the objects highlighted in your naturalist notebook. Zoom and take all the time you need.', '{"Selective Attention", "Visual Discrimination", "Calm Observation"}', 7),
    ('pattern-detective', 'MEMORY_THINKING', 'Pattern Detective', 'Complete playful sequences & color mysteries', 'Follow visual clues, recognize repeating patterns, and deduce what comes next in sequence.', 'Look closely at the repeating order of shapes and colors. Select the missing piece that completes the trail.', '{"Sequential Thinking", "Logical Deduction", "Spatial Reasoning"}', 6),
    ('story-builder', 'COMMUNICATION', 'Story Builder', 'Craft whimsical adventures step-by-step', 'Select characters, settings, and exciting twists to build imaginative illustrated tales.', 'Pick your hero, their magical companion, and where they embark. Choose what happens next or use gentle AI prompts.', '{"Narrative Structure", "Creative Expression", "Communication"}', 8),
    ('daily-life-simulator', 'EVERYDAY_LIFE', 'Daily Life Simulator', 'Practice everyday life routines with ease', 'Interactive scenarios for organizing backpacks, grocery shopping with budgets, and morning prep.', 'Select a daily scenario. Follow along step by step, choosing items needed and practicing real-world steps.', '{"Task Sequencing", "Organization", "Life Skills"}', 7)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id VARCHAR(50) NOT NULL REFERENCES games(id),
    difficulty VARCHAR(50) NOT NULL DEFAULT 'BEGINNER',
    status VARCHAR(50) NOT NULL DEFAULT 'STARTED', -- STARTED, IN_PROGRESS, PAUSED, COMPLETED, ABANDONED
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INT DEFAULT 0,
    attempts INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    score INT DEFAULT 0,
    feedback_notes TEXT
);

CREATE TABLE IF NOT EXISTS game_favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id VARCHAR(50) NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id)
);

CREATE TABLE IF NOT EXISTS game_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_key VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'Award',
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_key)
);

-- -----------------------------------------------------------------------------
-- 5. LEARNING CORNER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'BookOpen'
);

INSERT INTO learning_categories (id, name, description, icon_name) VALUES
    ('SCIENCE_NATURE', 'Science & Nature', 'Wonders of our living planet and outer cosmos', 'TreePine'),
    ('EVERYDAY_SCIENCE', 'Everyday Science', 'How things work in the world around us', 'Sparkles'),
    ('SPACE_EXPLORATION', 'Space & Planets', 'Fascinating journeys across galaxies and stars', 'Compass'),
    ('COMMUNICATION_ARTS', 'Communication & Arts', 'Creative stories, expression, and ideas', 'Palette')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS learning_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id VARCHAR(50) NOT NULL REFERENCES learning_categories(id),
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    original_text TEXT NOT NULL,
    simplified_text TEXT,
    reading_level VARCHAR(50) DEFAULT 'ACCESSIBLE',
    estimated_read_minutes INT DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_learning_contents (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES learning_contents(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    PRIMARY KEY (user_id, content_id)
);

-- -----------------------------------------------------------------------------
-- 6. ROUTINES & TASK MANAGEMENT (DAILY JOURNEY)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'MORNING', -- MORNING, AFTERNOON, EVENING, SCHOOL, WORK, CUSTOM
    icon_name VARCHAR(50) DEFAULT 'Sun',
    color_code VARCHAR(50) DEFAULT 'sage',
    is_recurring BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routine_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    detail TEXT,
    estimated_minutes INT DEFAULT 5,
    step_order INT NOT NULL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'DAILY', -- DAILY, STUDY, PERSONAL, HEALTH
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    due_date DATE,
    scheduled_time TIME,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- -----------------------------------------------------------------------------
-- 7. AI INTERACTION & USAGE LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_interaction_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- SIMPLIFY, EXPLAIN, RECOMMEND_GAMES, SUGGEST_ROUTINE, GENERATE_STORY
    model_name VARCHAR(100),
    tokens_used INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. NOTIFICATIONS & AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- INFO, REMINDER, CELEBRATION, SYSTEM
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user ON user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
