package com.neuronest.accessibility.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "accessibility_settings")
public class AccessibilitySettingsEntity {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "font_family", nullable = false, length = 50)
    private String fontFamily = "ATKINSON";

    @Column(name = "font_size", nullable = false, length = 20)
    private String fontSize = "MEDIUM";

    @Column(name = "line_spacing", nullable = false, length = 20)
    private String lineSpacing = "RELAXED";

    @Column(name = "letter_spacing", nullable = false, length = 20)
    private String letterSpacing = "NORMAL";

    @Column(name = "theme_preset", nullable = false, length = 50)
    private String themePreset = "WARM_CREAM";

    @Column(name = "contrast_mode", nullable = false, length = 20)
    private String contrastMode = "STANDARD";

    @Column(name = "animations_enabled", nullable = false)
    private boolean animationsEnabled = true;

    @Column(name = "reduced_motion", nullable = false)
    private boolean reducedMotion = false;

    @Column(name = "sound_effects_enabled", nullable = false)
    private boolean soundEffectsEnabled = true;

    @Column(name = "sound_volume", nullable = false)
    private int soundVolume = 70;

    @Column(name = "reading_ruler_enabled", nullable = false)
    private boolean readingRulerEnabled = false;

    @Column(name = "simplified_navigation", nullable = false)
    private boolean simplifiedNavigation = false;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public AccessibilitySettingsEntity() {}

    public AccessibilitySettingsEntity(User user) {
        this.user = user;
        this.userId = user.getId();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
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
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
