# NeuroNest — Educational Game Engine & Interactive Games

This document specifies the architecture, audio synthesis system, accessibility guarantees, and educational design of the 8 playable games in **NeuroNest**.

---

## 1. Core Philosophy: Non-Punitive, Encouraging Learning

Traditional educational video games often trigger cognitive anxiety through countdown timers, penalty buzzers, lives counters, and "Game Over" states. 

NeuroNest rejects punitive mechanics in favor of a calm, growth-oriented model:

| Traditional Game Mechanic | NeuroNest Replacement | Cognitive Benefit |
|---|---|---|
| Rigid countdown timers | Untimed play with optional gentle stopwatch | Eliminates time pressure anxiety for ADHD/ASD |
| "Game Over" / Failure states | "Keep exploring" / Gentle hints | Preserves self-efficacy and encourages persistence |
| Harsh negative audio buzzer | Low, soothing melodic chimes | Prevents sensory startle responses |
| High-contrast flashing visual cues | Soft organic transitions and pastel highlights | Prevents sensory overload / photophobia |
| Forced competitive leaderboards | Personal milestone celebration & effort streaks | Fosters intrinsic motivation |

---

## 2. Web Audio API Pure Sound Synthesizer

To guarantee instant auditory feedback with zero network latency and no external audio asset dependencies, NeuroNest implements a pure Web Audio API oscillator synthesis engine in `frontend/src/features/games/engine/soundUtils.ts`.

### Synthesizer Characteristics:
- **AudioContext**: Lazy-initialized on first user interaction to comply with modern browser autoplay policies.
- **Oscillator Types**: High-purity `sine` and `triangle` waveforms for pleasant, rounded timbres.
- **Envelope Shaping**: Linear and exponential gain ramps (`gainNode.gain.exponentialRampToValueAtTime`) preventing audio clicks or pops.
- **Mute & Volume Control**: Linked dynamically to `useAccessibilityStore`. When sound is disabled or muted, oscillators immediately bypass execution.

```typescript
// Tone Frequency Matrix
playChime()       -> 523.25 Hz (C5)  -> Smooth 0.35s sine decay
playMatch()       -> 587.33 Hz (D5) to 880.00 Hz (A5) -> Ascending chord
playSuccess()     -> 523.25 Hz -> 659.25 Hz -> 783.99 Hz (C Major Arpeggio)
playCelebration() -> Quad-tone cheerful fanfare with 0.8s tail
playGentleClick() -> 400.00 Hz -> Soft 0.05s triangle tap
```

---

## 3. The 8 Playable Educational Games

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NeuroNest Game Registry                         │
├──────────────────────┬────────────────────────┬────────────────────────┤
│ Game Name            │ Cognitive Focus Area   │ Accessibility Features │
├──────────────────────┼────────────────────────┼────────────────────────┤
│ 1. Memory Garden     │ Working Memory         │ Calm nature motifs     │
│ 2. Emotion Explorer  │ Socio-Emotional Coping │ Nuanced facial cues    │
│ 3. Word Builder      │ Phonics & Dyslexia     │ OpenDyslexic tiles     │
│ 4. Number Garden     │ Dyscalculia & Math     │ Ten-frame visual dots  │
│ 5. Focus Garden      │ Selective Attention    │ ADHD peaceful scenes   │
│ 6. Pattern Detective │ Sequential Logic       │ Predictable rules      │
│ 7. Story Builder     │ Narrative & Language   │ Web Speech TTS audio   │
│ 8. Daily Simulator   │ Executive Function     │ Real-world sequencing  │
└──────────────────────┴────────────────────────┴────────────────────────┘
```

### 3.1 Memory Garden (`MemoryGarden.tsx`)
- **Focus**: Working memory capacity and visual-spatial recall.
- **Design**: Players uncover soothing nature cards (plants, butterflies, droplets). 
- **Features**: Card flip animation with gentle chime audio, retry without penalty, progress indicator.

### 3.2 Emotion Explorer (`EmotionExplorer.tsx`)
- **Focus**: Social-emotional learning (SEL), emotion recognition, and healthy self-regulation.
- **Design**: Real-world scenarios (e.g., unexpected loud noises, changing plans) presenting diverse feelings (Excited, Anxious, Proud, Overwhelmed).
- **Features**: Follow-up "Helpful Coping Choice" step reinforcing positive behavioral strategies (e.g., deep breathing, taking a quiet break).

### 3.3 Word Builder (`WordBuilder.tsx`)
- **Focus**: Phonics, orthographic processing, and dyslexia support.
- **Design**: Words presented with phonetic clues, OpenDyslexic font support, letter scramble trays, and read-aloud TTS buttons.
- **Features**: Immediate auditory phonetic feedback upon placing letters into slots.

### 3.4 Number Garden (`NumberGarden.tsx`)
- **Focus**: Dyscalculia mitigation, quantity visualization, and basic arithmetic.
- **Design**: Numbers accompanied by dual visual representations (numeral, word, and visual count arrays / ten-frame arrangements).
- **Features**: Visual comparison puzzles reducing abstract numerical stress.

### 3.5 Focus Garden (`FocusGarden.tsx`)
- **Focus**: Selective visual attention, impulse control, and sustained focus for ADHD profiles.
- **Design**: A peaceful outdoor scene where players search for specific friendly items amidst a calm background without distracting rapid motion.
- **Features**: Gentle magnifying glass highlight, no penalty for clicking outside targets.

### 3.6 Pattern Detective (`PatternDetective.tsx`)
- **Focus**: Sequential reasoning, logical deduction, and pattern recognition.
- **Design**: Visual and numeric sequences with transparent repeating rules (e.g., alternating colors, geometric shapes, progressive counts).
- **Features**: Interactive rule explanation cards clarifying the logic behind each sequence.

### 3.7 Story Builder (`StoryBuilder.tsx`)
- **Focus**: Reading comprehension, narrative agency, and social decision-making.
- **Design**: Interactive branching stories where the player makes decisions that shape the narrative journey.
- **Features**: Fully integrated with browser Web Speech API for voice narration and adjustable speech velocity.

### 3.8 Daily Life Simulator (`DailyLifeSimulator.tsx`)
- **Focus**: Executive function, sequencing, and real-world task preparation.
- **Design**: Interactive scenarios (e.g., "Packing the School Bag", "Morning Hygiene Routine", "Simple Grocery Basket") requiring item selection and sequencing.
- **Features**: Encouraging checklist feedback, item reset capability, and visual cues.

---

## 4. Reusable Game Framework & State Management

All 8 games are constructed using shared architectural primitives:

1. **`GameContainer.tsx`**:
   - Universal header with game icon, title, description, and return navigation.
   - Live accessibility shortcuts (Audio toggle, Fullscreen, Reset game state).
   - Milestone celebratory modal on round completion.
2. **`useGameSession.ts`**:
   - Manages game session lifecycle with the backend API (`/api/v1/games/{id}/sessions`).
   - Automatically synchronizes score, items collected, and session duration upon completion.
   - Provides optimistic UI state if server is offline or experiencing latency.
3. **`gameRegistry.ts`**:
   - Central metadata directory specifying difficulty tags, age groups, cognitive focus, and route bindings.
