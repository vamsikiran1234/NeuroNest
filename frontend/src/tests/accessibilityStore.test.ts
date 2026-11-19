import { describe, it, expect, beforeEach } from 'vitest';
import { useAccessibilityStore } from '../stores/accessibilityStore';

describe('Accessibility Store & My Comfort Engine', () => {
  beforeEach(() => {
    const store = useAccessibilityStore.getState();
    store.resetDefaults();
  });

  it('initializes with gentle default comfort settings', () => {
    const state = useAccessibilityStore.getState();
    expect(state.themePreset).toBe('WARM_CREAM');
    expect(state.fontFamily).toBe('ATKINSON');
    expect(state.fontSize).toBe('MEDIUM');
    expect(state.lineSpacing).toBe('RELAXED');
    expect(state.letterSpacing).toBe('NORMAL');
    expect(state.reducedMotion).toBe(false);
    expect(state.quietModeEnabled).toBe(false);
    expect(state.readingRulerEnabled).toBe(false);
  });

  it('updates color themes across all inclusive presets', () => {
    const store = useAccessibilityStore.getState();
    const presets: Array<'WARM_CREAM' | 'SOFT_SAGE' | 'MUTED_LAVENDER' | 'DUSTY_BLUE' | 'HIGH_CONTRAST'> = [
      'SOFT_SAGE',
      'MUTED_LAVENDER',
      'DUSTY_BLUE',
      'HIGH_CONTRAST',
      'WARM_CREAM',
    ];

    for (const preset of presets) {
      store.setThemePreset(preset);
      expect(useAccessibilityStore.getState().themePreset).toBe(preset);
    }
  });

  it('updates font families including OpenDyslexic and Atkinson Hyperlegible', () => {
    const store = useAccessibilityStore.getState();
    store.setFontFamily('OPENDYSLEXIC');
    expect(useAccessibilityStore.getState().fontFamily).toBe('OPENDYSLEXIC');

    store.setFontFamily('ATKINSON');
    expect(useAccessibilityStore.getState().fontFamily).toBe('ATKINSON');
  });

  it('toggles reading ruler, reduced motion, and quiet mode', () => {
    const store = useAccessibilityStore.getState();

    store.setReadingRuler(true);
    expect(useAccessibilityStore.getState().readingRulerEnabled).toBe(true);

    store.setReducedMotion(true);
    expect(useAccessibilityStore.getState().reducedMotion).toBe(true);

    store.setQuietMode(true);
    expect(useAccessibilityStore.getState().quietModeEnabled).toBe(true);
  });
});
