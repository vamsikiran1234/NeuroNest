import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
import { 
  Palette, 
  Type, 
  Volume2, 
  Eye, 
  RotateCcw, 
  Sliders, 
  Check, 
  Sparkles,
  MousePointer,
  Compass
} from 'lucide-react';
import type { ThemePreset, FontFamily, FontSize, LineSpacing, LetterSpacing, PresentationProfile } from '../../types/accessibility';

export function ComfortPage() {
  const store = useAccessibilityStore();

  const themes: { id: ThemePreset; name: string; bg: string; border: string; desc: string }[] = [
    { id: 'WARM_CREAM', name: 'Warm Cream', bg: 'bg-[#F8F5EF]', border: 'border-[#DDD2C0]', desc: 'Gentle on eyes with warm, low-glare tones' },
    { id: 'SOFT_SAGE', name: 'Soft Sage', bg: 'bg-[#F2F7F3]', border: 'border-[#CFDFD2]', desc: 'Calming botanical green for reduced stress' },
    { id: 'MUTED_LAVENDER', name: 'Muted Lavender', bg: 'bg-[#F6F4FA]', border: 'border-[#DDD5EE]', desc: 'Serene purple hues that foster steady focus' },
    { id: 'DUSTY_BLUE', name: 'Dusty Blue', bg: 'bg-[#F2F6F9]', border: 'border-[#CDDFEA]', desc: 'Cool sky tranquility for balanced clarity' },
    { id: 'HIGH_CONTRAST', name: 'High Contrast', bg: 'bg-[#FFFFFF]', border: 'border-[#000000]', desc: 'Deep black on pure white for maximum legibility' },
    { id: 'DARK', name: 'Deep Night', bg: 'bg-[#1B2120]', border: 'border-[#384543]', desc: 'Dark ambient background for light sensitivity' },
  ];

  const fonts: { id: FontFamily; name: string; fontClass: string; desc: string }[] = [
    { id: 'ATKINSON', name: 'Atkinson Hyperlegible', fontClass: 'font-reading', desc: 'Engineered specifically for low vision & dyslexia distinction' },
    { id: 'NUNITO', name: 'Nunito Sans', fontClass: 'font-sans', desc: 'Friendly rounded curves that minimize visual tension' },
    { id: 'OPENDYSLEXIC', name: 'OpenDyslexic', fontClass: 'font-dyslexic', desc: 'Weighted bottoms to help orient letters and prevent flipping' },
    { id: 'SYSTEM', name: 'System Default', fontClass: 'font-sans', desc: 'Your operating system native typeface' },
  ];

  const fontSizes: { id: FontSize; label: string; sample: string }[] = [
    { id: 'SMALL', label: 'Compact', sample: '14px' },
    { id: 'MEDIUM', label: 'Balanced (Standard)', sample: '16px' },
    { id: 'LARGE', label: 'Generous', sample: '18px' },
    { id: 'EXTRA_LARGE', label: 'Spacious', sample: '21px' },
  ];

  const lineSpacings: { id: LineSpacing; label: string; desc: string }[] = [
    { id: 'NORMAL', label: 'Standard (1.5x)', desc: 'Balanced vertical line height' },
    { id: 'RELAXED', label: 'Relaxed (1.75x)', desc: 'Prevents eye skipping between lines' },
    { id: 'LOOSE', label: 'Loose (2.1x)', desc: 'Wide separation for comfortable tracking' },
  ];

  const profiles: { id: PresentationProfile; label: string; desc: string; icon: string }[] = [
    { id: 'YOUNG_EXPLORERS', label: 'Young Explorers', desc: 'Vibrant, friendly visuals, larger controls, and gentle guided discovery.', icon: '🎨' },
    { id: 'INDEPENDENT_LEARNERS', label: 'Independent Learners', desc: 'Clean, structured workspace with personal milestones and interactive activities.', icon: '🚀' },
    { id: 'EVERYDAY_COMPANION', label: 'Everyday Companion', desc: 'Minimalist, distraction-free environment for daily routines and practical organization.', icon: '🌿' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Sensory & Accessibility Center</span>
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-foreground">
            My Comfort
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mt-1">
            Neurodiversity means no two minds experience the world identically. Adjust colors, typography, sound, and motion so this space feels genuinely comfortable for you.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={store.resetDefaults}
          className="self-start sm:self-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Defaults</span>
        </Button>
      </div>

      {/* Presentation Profile Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-lavender-100 text-lavender-500">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Presentation Profile</CardTitle>
              <CardDescription>
                Customize how the interface communicates with you. You have full access to every feature across all profiles.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profiles.map((p) => {
              const isSelected = store.presentationProfile === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => store.setPresentationProfile(p.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-sage-50 ring-2 ring-primary/30 shadow-sm'
                      : 'border-border bg-card hover:bg-cream-100'
                  }`}
                >
                  <div>
                    <div className="text-3xl mb-3">{p.icon}</div>
                    <div className="font-bold text-base flex items-center justify-between text-foreground">
                      {p.label}
                      {isSelected && <Check className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Visual Atmosphere */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-dustyBlue-100 text-dustyBlue-500">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Visual Atmosphere & Themes</CardTitle>
              <CardDescription>
                Designed with soft, non-fluorescent tones to lower sensory fatigue and screen glare.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t) => {
              const isSelected = store.themePreset === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => store.setThemePreset(t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${t.bg} ${t.border} ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 scale-[1.01]' : 'hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-ink-900">{t.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-ink-500 mt-2">{t.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-100 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sage-200 text-sage-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Quiet Mode</div>
                <div className="text-xs text-muted-foreground">
                  Fades ambient decorations and highlights essentials for focused, low-stimulation time.
                </div>
              </div>
            </div>
            <Switch
              checked={store.quietModeEnabled}
              onCheckedChange={store.setQuietMode}
              aria-label="Toggle Quiet Mode"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography & Reading Assistance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-peach-100 text-peach-500">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Typography & Reading Ergonomics</CardTitle>
              <CardDescription>
                Customize typefaces, sizing, and spacing for effortless comprehension.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fonts.map((f) => {
              const isSelected = store.fontFamily === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => store.setFontFamily(f.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${f.fontClass} ${
                    isSelected
                      ? 'border-primary bg-sage-50 ring-1 ring-primary'
                      : 'border-border bg-card hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-base">
                    <span>{f.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{f.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Size and Spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-sm font-bold block mb-2">Text Scale</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {fontSizes.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => store.setFontSize(sz.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      store.fontSize === sz.id
                        ? 'border-primary bg-primary text-primary-foreground font-bold'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <div className="text-xs font-semibold">{sz.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{sz.sample}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Line Spacing</label>
              <div className="grid grid-cols-3 gap-2">
                {lineSpacings.map((ls) => (
                  <button
                    key={ls.id}
                    onClick={() => store.setLineSpacing(ls.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      store.lineSpacing === ls.id
                        ? 'border-primary bg-primary text-primary-foreground font-bold'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <div className="text-xs font-semibold">{ls.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reading Ruler Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-100 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-dustyBlue-100 text-dustyBlue-500">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Focus Reading Guide (Ruler)</div>
                <div className="text-xs text-muted-foreground">
                  A gentle translucent bar that moves with your cursor or finger to maintain line focus while reading.
                </div>
              </div>
            </div>
            <Switch
              checked={store.readingRulerEnabled}
              onCheckedChange={store.setReadingRuler}
              aria-label="Toggle Reading Ruler"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sensory & Motion Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-100 text-sage-700">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Sensory Load & Sound Controls</CardTitle>
              <CardDescription>
                Full control over animations, movement transitions, and auditory feedback.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
            <div>
              <div className="font-semibold text-sm">Reduced Motion</div>
              <div className="text-xs text-muted-foreground">
                Disables sliding cards, bounces, and page transitions for vestibular comfort.
              </div>
            </div>
            <Switch
              checked={store.reducedMotion}
              onCheckedChange={store.setReducedMotion}
              aria-label="Toggle Reduced Motion"
            />
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Auditory Feedback & Game Sounds</div>
                <div className="text-xs text-muted-foreground">
                  Pleasant, calm chimes for card matching, completed steps, and achievements.
                </div>
              </div>
              <Switch
                checked={store.soundEffectsEnabled}
                onCheckedChange={store.setSoundEffects}
                aria-label="Toggle Sound Effects"
              />
            </div>

            {store.soundEffectsEnabled && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Effect Volume</span>
                  <span>{store.soundVolume}%</span>
                </div>
                <Slider
                  value={[store.soundVolume]}
                  onValueChange={(val) => store.setSoundVolume(val[0])}
                  min={10}
                  max={100}
                  step={5}
                  aria-label="Sound volume"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
