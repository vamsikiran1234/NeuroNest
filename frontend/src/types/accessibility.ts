export type ThemePreset =
  | 'WARM_CREAM'
  | 'SOFT_SAGE'
  | 'MUTED_LAVENDER'
  | 'DUSTY_BLUE'
  | 'HIGH_CONTRAST'
  | 'DARK';

export type FontFamily = 'ATKINSON' | 'NUNITO' | 'OPENDYSLEXIC' | 'SYSTEM';
export type FontSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
export type LineSpacing = 'NORMAL' | 'RELAXED' | 'LOOSE';
export type LetterSpacing = 'NORMAL' | 'WIDE' | 'WIDER';

export type PresentationProfile =
  | 'YOUNG_EXPLORERS'
  | 'INDEPENDENT_LEARNERS'
  | 'EVERYDAY_COMPANION';

export interface AccessibilitySettings {
  themePreset: ThemePreset;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  letterSpacing: LetterSpacing;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  soundEffectsEnabled: boolean;
  soundVolume: number;
  readingRulerEnabled: boolean;
  simplifiedNavigation: boolean;
  quietModeEnabled: boolean;
  presentationProfile: PresentationProfile;
}
