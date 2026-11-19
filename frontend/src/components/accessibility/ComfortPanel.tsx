import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog';
import { Switch } from '../ui/Switch';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { 
  Sparkles, 
  Type, 
  Palette, 
  Volume2, 
  Sliders, 
  Eye, 
  RotateCcw,
  Check
} from 'lucide-react';
import type { ThemePreset, FontFamily, FontSize, LineSpacing, LetterSpacing, PresentationProfile } from '../../types/accessibility';

interface ComfortPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComfortPanel({ open, onOpenChange }: ComfortPanelProps) {
  const store = useAccessibilityStore();

  const themes: { id: ThemePreset; name: string; bg: string; border: string }[] = [
    { id: 'WARM_CREAM', name: 'Warm Cream', bg: 'bg-[#F8F5EF]', border: 'border-[#DDD2C0]' },
    { id: 'SOFT_SAGE', name: 'Soft Sage', bg: 'bg-[#F2F7F3]', border: 'border-[#CFDFD2]' },
    { id: 'MUTED_LAVENDER', name: 'Lavender Calm', bg: 'bg-[#F6F4FA]', border: 'border-[#DDD5EE]' },
    { id: 'DUSTY_BLUE', name: 'Dusty Blue', bg: 'bg-[#F2F6F9]', border: 'border-[#CDDFEA]' },
    { id: 'HIGH_CONTRAST', name: 'High Contrast', bg: 'bg-[#FFFFFF]', border: 'border-[#000000]' },
    { id: 'DARK', name: 'Deep Night', bg: 'bg-[#1B2120]', border: 'border-[#384543]' },
  ];

  const fonts: { id: FontFamily; name: string; fontClass: string }[] = [
    { id: 'ATKINSON', name: 'Atkinson Hyperlegible (Clear reading)', fontClass: 'font-reading' },
    { id: 'NUNITO', name: 'Nunito Sans (Rounded & gentle)', fontClass: 'font-sans' },
    { id: 'OPENDYSLEXIC', name: 'OpenDyslexic (Dyslexia support)', fontClass: 'font-dyslexic' },
    { id: 'SYSTEM', name: 'System Default', fontClass: 'font-sans' },
  ];

  const fontSizes: { id: FontSize; label: string }[] = [
    { id: 'SMALL', label: 'A (Small)' },
    { id: 'MEDIUM', label: 'A (Standard)' },
    { id: 'LARGE', label: 'A (Large)' },
    { id: 'EXTRA_LARGE', label: 'A (Extra)' },
  ];

  const lineSpacings: { id: LineSpacing; label: string }[] = [
    { id: 'NORMAL', label: 'Normal' },
    { id: 'RELAXED', label: 'Relaxed' },
    { id: 'LOOSE', label: 'Loose' },
  ];

  const profiles: { id: PresentationProfile; label: string; desc: string; icon: string }[] = [
    { id: 'YOUNG_EXPLORERS', label: 'Young Explorers', desc: 'Friendly visuals, larger buttons & playful exploration', icon: '🎨' },
    { id: 'INDEPENDENT_LEARNERS', label: 'Independent Learners', desc: 'Clean layout, self-paced focus & interactive challenges', icon: '🚀' },
    { id: 'EVERYDAY_COMPANION', label: 'Everyday Companion', desc: 'Minimalist, calm & distraction-free daily organization', icon: '🌿' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sage-100 text-sage-700">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle>My Comfort & Accessibility</DialogTitle>
                <DialogDescription>
                  Personalize the platform to match how your senses and brain learn best.
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={store.resetDefaults}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="visual" className="gap-1.5">
              <Palette className="w-4 h-4" /> Visual
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-1.5">
              <Type className="w-4 h-4" /> Reading
            </TabsTrigger>
            <TabsTrigger value="sensory" className="gap-1.5">
              <Volume2 className="w-4 h-4" /> Sensory
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5">
              <Sparkles className="w-4 h-4" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* VISUAL THEMES */}
          <TabsContent value="visual" className="space-y-5 pt-3">
            <div>
              <label className="text-sm font-bold text-foreground block mb-2">Color Atmosphere</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((t) => {
                  const isSelected = store.themePreset === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => store.setThemePreset(t.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                        t.bg
                      } ${t.border} ${
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]'
                          : 'hover:opacity-90'
                      }`}
                    >
                      <span className="text-sm font-semibold text-ink-900">{t.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-100 border border-border">
              <div>
                <div className="font-semibold text-sm">Quiet Mode</div>
                <div className="text-xs text-muted-foreground">
                  Dims non-essential decorations and simplifies visual elements for low sensory load.
                </div>
              </div>
              <Switch
                checked={store.quietModeEnabled}
                onCheckedChange={store.setQuietMode}
                aria-label="Toggle Quiet Mode"
              />
            </div>
          </TabsContent>

          {/* READING & TYPOGRAPHY */}
          <TabsContent value="reading" className="space-y-5 pt-3">
            <div>
              <label className="text-sm font-bold text-foreground block mb-2">Typography & Font Choice</label>
              <div className="space-y-2">
                {fonts.map((f) => {
                  const isSelected = store.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => store.setFontFamily(f.id)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        f.fontClass
                      } ${
                        isSelected
                          ? 'border-primary bg-sage-50 ring-1 ring-primary'
                          : 'border-border bg-card hover:bg-cream-100'
                      }`}
                    >
                      <span className="text-base font-medium">{f.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Text Size</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {fontSizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => store.setFontSize(sz.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        store.fontSize === sz.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:bg-cream-100'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Line Spacing</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {lineSpacings.map((ls) => (
                    <button
                      key={ls.id}
                      onClick={() => store.setLineSpacing(ls.id)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        store.lineSpacing === ls.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:bg-cream-100'
                      }`}
                    >
                      {ls.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-cream-100 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-dustyBlue-100 text-dustyBlue-500">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Focus Reading Ruler</div>
                  <div className="text-xs text-muted-foreground">
                    Highlights the current reading line following your cursor or finger to ease eye strain.
                  </div>
                </div>
              </div>
              <Switch
                checked={store.readingRulerEnabled}
                onCheckedChange={store.setReadingRuler}
                aria-label="Toggle Reading Ruler"
              />
            </div>
          </TabsContent>

          {/* SENSORY & MOTION */}
          <TabsContent value="sensory" className="space-y-4 pt-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
              <div>
                <div className="font-semibold text-sm">Reduce Motion & Animations</div>
                <div className="text-xs text-muted-foreground">
                  Minimizes transitions, sliding movements, and flashing visual cues.
                </div>
              </div>
              <Switch
                checked={store.reducedMotion}
                onCheckedChange={store.setReducedMotion}
                aria-label="Toggle Reduced Motion"
              />
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Gentle Sound Effects</div>
                  <div className="text-xs text-muted-foreground">
                    Auditory confirmations for card flips, completed tasks, and achievements.
                  </div>
                </div>
                <Switch
                  checked={store.soundEffectsEnabled}
                  onCheckedChange={store.setSoundEffects}
                  aria-label="Toggle Sound Effects"
                />
              </div>

              {store.soundEffectsEnabled && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Volume</span>
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
          </TabsContent>

          {/* PRESENTATION PROFILE */}
          <TabsContent value="profile" className="space-y-3 pt-3">
            <p className="text-xs text-muted-foreground">
              Choose how information is presented to best support your learning preferences. All features remain fully available.
            </p>
            <div className="space-y-3">
              {profiles.map((p) => {
                const isSelected = store.presentationProfile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => store.setPresentationProfile(p.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-4 transition-all ${
                      isSelected
                        ? 'border-primary bg-sage-50 ring-2 ring-primary/40'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-white shadow-sm">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-base flex items-center justify-between">
                        {p.label}
                        {isSelected && <Check className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
