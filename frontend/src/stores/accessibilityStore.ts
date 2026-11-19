import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccessibilitySettings, ThemePreset, FontFamily, FontSize, LineSpacing, LetterSpacing, PresentationProfile } from '../types/accessibility';

interface AccessibilityState extends AccessibilitySettings {
  setThemePreset: (preset: ThemePreset) => void;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
  setLetterSpacing: (spacing: LetterSpacing) => void;
  setReducedMotion: (enabled: boolean) => void;
  setSoundEffects: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setReadingRuler: (enabled: boolean) => void;
  setSimplifiedNavigation: (enabled: boolean) => void;
  setQuietMode: (enabled: boolean) => void;
  setPresentationProfile: (profile: PresentationProfile) => void;
  resetDefaults: () => void;
  applyToDOM: () => void;
}

const defaultSettings: AccessibilitySettings = {
  themePreset: 'WARM_CREAM',
  fontFamily: 'ATKINSON',
  fontSize: 'MEDIUM',
  lineSpacing: 'RELAXED',
  letterSpacing: 'NORMAL',
  animationsEnabled: true,
  reducedMotion: false,
  soundEffectsEnabled: true,
  soundVolume: 70,
  readingRulerEnabled: false,
  simplifiedNavigation: false,
  quietModeEnabled: false,
  presentationProfile: 'INDEPENDENT_LEARNERS',
};

function applyClassesToDocument(state: AccessibilitySettings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  // Clear existing theme classes
  body.classList.remove(
    'theme-warm-cream',
    'theme-soft-sage',
    'theme-muted-lavender',
    'theme-dusty-blue',
    'theme-high-contrast',
    'theme-dark'
  );

  switch (state.themePreset) {
    case 'SOFT_SAGE': body.classList.add('theme-soft-sage'); break;
    case 'MUTED_LAVENDER': body.classList.add('theme-muted-lavender'); break;
    case 'DUSTY_BLUE': body.classList.add('theme-dusty-blue'); break;
    case 'HIGH_CONTRAST': body.classList.add('theme-high-contrast'); break;
    case 'DARK': body.classList.add('theme-dark'); break;
    default: body.classList.add('theme-warm-cream'); break;
  }

  // Font family
  body.classList.remove('font-atkinson', 'font-nunito', 'font-dyslexic', 'font-system');
  switch (state.fontFamily) {
    case 'NUNITO': body.classList.add('font-nunito'); break;
    case 'OPENDYSLEXIC': body.classList.add('font-dyslexic'); break;
    case 'SYSTEM': body.classList.add('font-system'); break;
    default: body.classList.add('font-atkinson'); break;
  }

  // Font size
  body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
  switch (state.fontSize) {
    case 'SMALL': body.classList.add('font-size-small'); break;
    case 'LARGE': body.classList.add('font-size-large'); break;
    case 'EXTRA_LARGE': body.classList.add('font-size-xlarge'); break;
    default: body.classList.add('font-size-medium'); break;
  }

  // Line spacing
  body.classList.remove('spacing-normal', 'spacing-relaxed', 'spacing-loose');
  switch (state.lineSpacing) {
    case 'NORMAL': body.classList.add('spacing-normal'); break;
    case 'LOOSE': body.classList.add('spacing-loose'); break;
    default: body.classList.add('spacing-relaxed'); break;
  }

  // Letter spacing
  body.classList.remove('letter-normal', 'letter-wide', 'letter-wider');
  switch (state.letterSpacing) {
    case 'WIDE': body.classList.add('letter-wide'); break;
    case 'WIDER': body.classList.add('letter-wider'); break;
    default: body.classList.add('letter-normal'); break;
  }

  // Reduced motion
  if (state.reducedMotion) {
    body.classList.add('reduced-motion');
  } else {
    body.classList.remove('reduced-motion');
  }

  // Quiet Mode
  if (state.quietModeEnabled) {
    body.classList.add('quiet-mode');
  } else {
    body.classList.remove('quiet-mode');
  }
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setThemePreset: (themePreset) => {
        set({ themePreset });
        applyClassesToDocument({ ...get(), themePreset });
      },

      setFontFamily: (fontFamily) => {
        set({ fontFamily });
        applyClassesToDocument({ ...get(), fontFamily });
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
        applyClassesToDocument({ ...get(), fontSize });
      },

      setLineSpacing: (lineSpacing) => {
        set({ lineSpacing });
        applyClassesToDocument({ ...get(), lineSpacing });
      },

      setLetterSpacing: (letterSpacing) => {
        set({ letterSpacing });
        applyClassesToDocument({ ...get(), letterSpacing });
      },

      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion });
        applyClassesToDocument({ ...get(), reducedMotion });
      },

      setSoundEffects: (soundEffectsEnabled) => set({ soundEffectsEnabled }),

      setSoundVolume: (soundVolume) => set({ soundVolume }),

      setReadingRuler: (readingRulerEnabled) => set({ readingRulerEnabled }),

      setSimplifiedNavigation: (simplifiedNavigation) => set({ simplifiedNavigation }),

      setQuietMode: (quietModeEnabled) => {
        set({ quietModeEnabled });
        applyClassesToDocument({ ...get(), quietModeEnabled });
      },

      setPresentationProfile: (presentationProfile) => set({ presentationProfile }),

      resetDefaults: () => {
        set(defaultSettings);
        applyClassesToDocument(defaultSettings);
      },

      applyToDOM: () => {
        applyClassesToDocument(get());
      },
    }),
    {
      name: 'neuronest-accessibility-preferences',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyClassesToDocument(state);
        }
      },
    }
  )
);
