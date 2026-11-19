# NeuroNest — Accessibility Engine & WCAG 2.1 AA Specifications

Accessibility is not an afterthought or an add-on in **NeuroNest**; it is the fundamental architectural foundation upon which all modules, games, and user interfaces are constructed.

---

## 1. Regulatory Standards & WCAG 2.1 AA Compliance

NeuroNest strictly adheres to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards:

| Principle | Guideline | NeuroNest Implementation |
|---|---|---|
| **Perceivable** | 1.4.3 Contrast (Minimum) | Every color palette guarantees at least a **4.5:1** contrast ratio for standard body text and **3:1** for large text and interactive UI elements. |
| | 1.4.12 Text Spacing | Dynamic adjustment of line height (up to 2.0x), letter spacing, and word spacing without text truncation or layout breakage. |
| | 1.4.4 Resize Text | Supports up to 200% font scaling through dynamic CSS root rem variables without loss of content or functionality. |
| **Operable** | 2.1.1 Keyboard Accessible | All components, buttons, game controls, dialogs, and forms are fully navigable via `Tab`, `Shift+Tab`, `Enter`, and `Space`. |
| | 2.4.7 Focus Visible | High-visibility custom focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500`) on all interactive controls. |
| | 2.2.2 Pause, Stop, Hide | Complete user control to disable auto-updating elements, animations, and sound effects. |
| | 2.3.1 Three Flashes or Below | Zero flashing, strobe, or high-frequency flickering visuals across the entire application. |
| **Understandable** | 3.1.5 Reading Level | Dedicated AI Text Simplification and tiered learning content (Standard vs. Simplified modes). |
| | 3.2.3 Consistent Navigation | Unified top navigation bar and bottom drawer layout with persistent landmarks across all routes. |
| **Robust** | 4.1.2 Name, Role, Value | Built using accessible Radix UI primitives with full ARIA attributes (`aria-expanded`, `aria-controls`, `aria-live`, `aria-label`). |

---

## 2. "My Comfort" Engine Architecture

The sensory personalization engine is powered by a high-performance Zustand state store (`frontend/src/store/accessibilityStore.ts`) synced automatically to `localStorage` and optionally persisted to the backend user profile.

### 2.1 Sensory Theme Presets

Sensory processing differences require distinct color palettes to prevent visual fatigue, sensory overload, and migraine triggers:

1. **Default Ocean**: Soft slate blue and teal tones providing a balanced, tranquil atmosphere.
2. **Forest Calm**: Organic sage green and eucalyptus tones designed to reduce autonomic arousal and cortisol stress.
3. **Sunset Warmth**: Muted amber, terracotta, and soft peach tones designed for evening use and blue-light minimization.
4. **Lavender Dream**: Delicate pastel purple and lilac tones proven to assist sensory relaxation for ASD individuals.
5. **High Contrast Dark**: True black background (`#0b0f19`) with high-contrast pastel yellow and cyan text for low-vision and photophobic users.
6. **High Contrast Light**: Pure crisp white background (`#ffffff`) with deep obsidian text (`#0a0f1d`) offering maximum contrast (> 12:1).

### 2.2 Neurodiversity-Engineered Typography

Users can instantly switch between three specialized font families designed for cognitive differences:

- **Atkinson Hyperlegible**: Developed by the Braille Institute to dramatically improve letter recognition through exaggerated distinct shapes (e.g., distinguishing `1`, `I`, `l`, `|`).
- **OpenDyslexic**: Features heavily weighted bottom letterforms to provide gravity, combating rotational symmetry errors and letter flipping common in dyslexia (`b` vs `d`, `p` vs `q`).
- **Lexend**: Engineered based on educational research to reduce visual crowding and increase reading fluency.
- **System Sans**: Default clean sans-serif for standard readability.

---

## 3. Specialized Neurodiverse Reading & Focus Tools

### 3.1 Interactive Reading Ruler (`ReadingRuler.tsx`)
- An overlay guide that tracks the mouse pointer or scroll position.
- Dims the rest of the viewport while highlighting a single reading line (height customizable from 30px to 80px).
- Assists readers with ADHD and Dyslexia to maintain line tracking without visual wandering.

### 3.2 Sensory "Quiet Mode"
- Eliminates non-essential visual elements, badges, decorative background illustrations, and floating animations.
- Simplifies cards to minimal borders and high-legibility text blocks.
- Mutes background ambient sounds and reduces notification frequency.

### 3.3 Web Speech API Text-to-Speech (TTS)
- Native client-side voice synthesis available on Learning Corner articles, stories, and AI assistant responses.
- Allows readers to listen to content at customizable playback speeds (0.7x, 0.85x, 1.0x, 1.2x).
- Visually highlights current sentences as they are spoken.

### 3.4 Motor & Motion Accommodations
- **Reduced Motion**: Automatically honors the user's OS-level `prefers-reduced-motion` setting while providing an explicit toggle to disable all CSS and Motion animations.
- **Enlarged Touch Targets**: Interactive buttons and game tiles adhere to a minimum size of 44x44 CSS pixels to accommodate motor coordination challenges.
