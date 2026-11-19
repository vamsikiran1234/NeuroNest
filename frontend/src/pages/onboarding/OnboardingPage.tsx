import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { Input } from '../../components/ui/Input';
import {
  Compass,
  Sparkles,
  Target,
  Palette,
  Check,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Sliders,
  Heart,
  BookOpen,
  CalendarCheck2,
  Gamepad2,
  Brain,
  MessageCircle,
  Puzzle,
  Pencil
} from 'lucide-react';
import type { PresentationProfile, ThemePreset, FontFamily } from '../../types/accessibility';

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Form State
  const [preferredName, setPreferredName] = useState(user?.displayName || '');
  const [selectedProfile, setSelectedProfile] = useState<PresentationProfile>('INDEPENDENT_LEARNERS');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['GAMES', 'READING', 'ROUTINES']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Practice attention activities',
    'Organize daily tasks'
  ]);
  const [themeChoice, setThemeChoice] = useState<ThemePreset>('WARM_CREAM');
  const [fontChoice, setFontChoice] = useState<FontFamily>('ATKINSON');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setGlobalTheme = useAccessibilityStore((s) => s.setThemePreset);
  const setGlobalFont = useAccessibilityStore((s) => s.setFontFamily);
  const setGlobalProfile = useAccessibilityStore((s) => s.setPresentationProfile);
  const setGlobalReducedMotion = useAccessibilityStore((s) => s.setReducedMotion);
  const setGlobalSound = useAccessibilityStore((s) => s.setSoundEffects);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Sync to local global accessibility store
      setGlobalProfile(selectedProfile);
      setGlobalTheme(themeChoice);
      setGlobalFont(fontChoice);
      setGlobalReducedMotion(reducedMotion);
      setGlobalSound(soundEffects);

      // Submit to backend API
      await apiClient.post('/personalization/onboarding', {
        preferredName,
        presentationProfile: selectedProfile,
        interests: selectedInterests,
        goals: selectedGoals,
        themePreset: themeChoice,
        fontFamily: fontChoice,
        reducedMotion,
        soundEffectsEnabled: soundEffects,
      });

      navigate('/app');
    } catch {
      // If server is in offline fallback mode, still proceed into the app
      navigate('/app');
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    { id: 'GAMES', label: 'Playful Games', icon: Gamepad2, color: 'bg-sage-100 text-sage-700' },
    { id: 'READING', label: 'Reading & Stories', icon: BookOpen, color: 'bg-dustyBlue-100 text-dustyBlue-600' },
    { id: 'PUZZLES', label: 'Logic & Puzzles', icon: Puzzle, color: 'bg-lavender-100 text-lavender-600' },
    { id: 'DRAWING', label: 'Visuals & Drawing', icon: Pencil, color: 'bg-peach-100 text-peach-600' },
    { id: 'NUMBERS', label: 'Numbers & Math', icon: Target, color: 'bg-sage-100 text-sage-700' },
    { id: 'COMMUNICATION', label: 'Social & Talking', icon: MessageCircle, color: 'bg-lavender-100 text-lavender-600' },
    { id: 'ROUTINES', label: 'Daily Routines', icon: CalendarCheck2, color: 'bg-dustyBlue-100 text-dustyBlue-600' },
    { id: 'FOCUS', label: 'Calm Focus Activities', icon: Brain, color: 'bg-cream-200 text-ink-900' },
  ];

  const goalOptions = [
    'Practice gentle focus and attention',
    'Explore reading at my own pace',
    'Organize daily tasks without pressure',
    'Practice communication & social understanding',
    'Explore problem-solving and patterns',
    'Learn everyday life and planning skills',
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-background text-foreground transition-colors duration-200">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>Personalizing NeuroNest</span>
          </div>
          <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <Card className="border-border shadow-md">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="w-16 h-16 rounded-3xl bg-sage-100 text-primary flex items-center justify-center text-3xl mx-auto shadow-sm">
                🌱
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-sans tracking-tight">
                Welcome to NeuroNest
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground font-reading max-w-md mx-auto">
                "A space where every mind finds its way."
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-foreground/85 leading-relaxed">
                Neurodiversity is not a single, uniform experience. We believe technology should adapt to you, rather than forcing you to adapt to it.
              </p>
              <div className="pt-2 max-w-sm mx-auto text-left">
                <Input
                  label="What name would you like us to call you?"
                  placeholder="e.g. Alex"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)} size="lg" className="gap-2">
                Begin Personalization <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: PRESENTATION PROFILE */}
        {step === 2 && (
          <Card className="border-border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <Compass className="w-4 h-4" /> Presentation Choice
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                Choose your preferred visual atmosphere
              </CardTitle>
              <CardDescription>
                These are presentation styles, not rigid diagnostic buckets. You can change this anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: 'YOUNG_EXPLORERS' as PresentationProfile,
                  title: 'Young Explorers',
                  icon: '🎨',
                  desc: 'Playful illustrated elements, larger touch controls, friendly guide characters, and encouraging games.',
                },
                {
                  id: 'INDEPENDENT_LEARNERS' as PresentationProfile,
                  title: 'Independent Learners',
                  icon: '🚀',
                  desc: 'Modern balanced workspace with personal learning goals, skill exploration, and interactive challenges.',
                },
                {
                  id: 'EVERYDAY_COMPANION' as PresentationProfile,
                  title: 'Everyday Companion',
                  icon: '🌿',
                  desc: 'Minimalist, distraction-free atmosphere focused on daily routine checklists, calm pacing, and organization.',
                },
              ].map((p) => {
                const isSelected = selectedProfile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-primary bg-sage-50 ring-2 ring-primary/30'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-white shadow-sm flex-shrink-0">{p.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-base flex items-center justify-between text-foreground">
                        {p.title}
                        {isSelected && <Check className="w-5 h-5 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: SELECT INTERESTS */}
        {step === 3 && (
          <Card className="border-border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <Heart className="w-4 h-4" /> Topics & Joy
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                What activities do you enjoy exploring?
              </CardTitle>
              <CardDescription>
                Select whatever catches your eye. We use this to surface relevant educational activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interestOptions.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-primary bg-sage-50 ring-1 ring-primary'
                          : 'border-border bg-card hover:bg-cream-100'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${opt.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(4)} className="gap-2">
                Next: Goals <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 4: PERSONAL GOALS */}
        {step === 4 && (
          <Card className="border-border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <Target className="w-4 h-4" /> Personal Growth
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                What would you like to practice?
              </CardTitle>
              <CardDescription>
                These are self-directed milestones without pressure or competitive leaderboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-sage-50 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{goal}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary text-white' : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(5)} className="gap-2">
                Next: Sensory &amp; Comfort <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 5: SENSORY & ACCESSIBILITY */}
        {step === 5 && (
          <Card className="border-border shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                <Palette className="w-4 h-4" /> Sensory Comfort
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                Fine-tune your comfort settings
              </CardTitle>
              <CardDescription>
                Choose color tones, typefaces, and motion preferences that feel calmest for your senses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Theme presets */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Color Atmosphere</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'WARM_CREAM' as ThemePreset, label: 'Warm Cream', bg: 'bg-[#F8F5EF]' },
                    { id: 'SOFT_SAGE' as ThemePreset, label: 'Soft Sage', bg: 'bg-[#F2F7F3]' },
                    { id: 'MUTED_LAVENDER' as ThemePreset, label: 'Lavender', bg: 'bg-[#F6F4FA]' },
                    { id: 'DUSTY_BLUE' as ThemePreset, label: 'Dusty Blue', bg: 'bg-[#F2F6F9]' },
                    { id: 'HIGH_CONTRAST' as ThemePreset, label: 'High Contrast', bg: 'bg-[#FFFFFF]' },
                    { id: 'DARK' as ThemePreset, label: 'Deep Night', bg: 'bg-[#1B2120]' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setThemeChoice(t.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-ink-900 transition-all ${
                        t.bg
                      } ${themeChoice === t.id ? 'ring-2 ring-primary border-primary' : 'border-border'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font choices */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Reading Typeface</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ATKINSON' as FontFamily, label: 'Atkinson Hyperlegible' },
                    { id: 'NUNITO' as FontFamily, label: 'Nunito Sans' },
                    { id: 'OPENDYSLEXIC' as FontFamily, label: 'OpenDyslexic' },
                    { id: 'SYSTEM' as FontFamily, label: 'System Default' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontChoice(f.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        fontChoice === f.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100 border border-border">
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">Reduced Motion</div>
                    <div className="text-muted-foreground">Minimizes sliding and bouncing transitions</div>
                  </div>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                    aria-label="Toggle reduced motion"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100 border border-border">
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">Gentle Sound Feedback</div>
                    <div className="text-muted-foreground">Auditory chimes for completed activities</div>
                  </div>
                  <Switch
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                    aria-label="Toggle sound effects"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(4)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(6)} className="gap-2">
                Review Summary <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 6: CONFIRMATION & ENTER */}
        {step === 6 && (
          <Card className="border-border shadow-md">
            <CardHeader className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-sage-100 text-primary flex items-center justify-center mx-auto text-2xl">
                ✨
              </div>
              <CardTitle className="text-2xl">Your Space is Ready!</CardTitle>
              <CardDescription>
                Here is a summary of your personalized environment, {preferredName || 'Explorer'}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-cream-100 border border-border space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-muted-foreground">Presentation Style</span>
                  <span className="font-bold capitalize">{selectedProfile.toLowerCase().replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-muted-foreground">Selected Interests</span>
                  <span className="font-bold">{selectedInterests.length} topics selected</span>
                </div>
                <div className="flex justify-between border-b border-border/80 pb-2">
                  <span className="text-muted-foreground">Learning Goals</span>
                  <span className="font-bold">{selectedGoals.length} goals activated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Atmosphere &amp; Font</span>
                  <span className="font-bold">{themeChoice.toLowerCase().replace('_', ' ')} / {fontChoice}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Remember: you can adjust any of these settings at any time using the <strong>My Comfort</strong> menu.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(5)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleFinish} isLoading={isSubmitting} size="lg" className="gap-2">
                Enter My Space <Sparkles className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
