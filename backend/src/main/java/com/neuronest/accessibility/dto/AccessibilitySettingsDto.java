package com.neuronest.accessibility.dto;

public class AccessibilitySettingsDto {
    private String fontFamily;
    private String fontSize;
    private String lineSpacing;
    private String letterSpacing;
    private String themePreset;
    private String contrastMode;
    private boolean animationsEnabled;
    private boolean reducedMotion;
    private boolean soundEffectsEnabled;
    private int soundVolume;
    private boolean readingRulerEnabled;
    private boolean simplifiedNavigation;

    public AccessibilitySettingsDto() {}

    public AccessibilitySettingsDto(String fontFamily, String fontSize, String lineSpacing, String letterSpacing, String themePreset, String contrastMode, boolean animationsEnabled, boolean reducedMotion, boolean soundEffectsEnabled, int soundVolume, boolean readingRulerEnabled, boolean simplifiedNavigation) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.lineSpacing = lineSpacing;
        this.letterSpacing = letterSpacing;
        this.themePreset = themePreset;
        this.contrastMode = contrastMode;
        this.animationsEnabled = animationsEnabled;
        this.reducedMotion = reducedMotion;
        this.soundEffectsEnabled = soundEffectsEnabled;
        this.soundVolume = soundVolume;
        this.readingRulerEnabled = readingRulerEnabled;
        this.simplifiedNavigation = simplifiedNavigation;
    }

    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
    public String getFontSize() { return fontSize; }
    public void setFontSize(String fontSize) { this.fontSize = fontSize; }
    public String getLineSpacing() { return lineSpacing; }
    public void setLineSpacing(String lineSpacing) { this.lineSpacing = lineSpacing; }
    public String getLetterSpacing() { return letterSpacing; }
    public void setLetterSpacing(String letterSpacing) { this.letterSpacing = letterSpacing; }
    public String getThemePreset() { return themePreset; }
    public void setThemePreset(String themePreset) { this.themePreset = themePreset; }
    public String getContrastMode() { return contrastMode; }
    public void setContrastMode(String contrastMode) { this.contrastMode = contrastMode; }
    public boolean isAnimationsEnabled() { return animationsEnabled; }
    public void setAnimationsEnabled(boolean animationsEnabled) { this.animationsEnabled = animationsEnabled; }
    public boolean isReducedMotion() { return reducedMotion; }
    public void setReducedMotion(boolean reducedMotion) { this.reducedMotion = reducedMotion; }
    public boolean isSoundEffectsEnabled() { return soundEffectsEnabled; }
    public void setSoundEffectsEnabled(boolean soundEffectsEnabled) { this.soundEffectsEnabled = soundEffectsEnabled; }
    public int getSoundVolume() { return soundVolume; }
    public void setSoundVolume(int soundVolume) { this.soundVolume = soundVolume; }
    public boolean isReadingRulerEnabled() { return readingRulerEnabled; }
    public void setReadingRulerEnabled(boolean readingRulerEnabled) { this.readingRulerEnabled = readingRulerEnabled; }
    public boolean isSimplifiedNavigation() { return simplifiedNavigation; }
    public void setSimplifiedNavigation(boolean simplifiedNavigation) { this.simplifiedNavigation = simplifiedNavigation; }
}
