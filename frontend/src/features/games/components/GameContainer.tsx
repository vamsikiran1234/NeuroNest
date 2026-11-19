import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/Dialog';
import { useAccessibilityStore } from '../../../stores/accessibilityStore';
import {
  ArrowLeft,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { GameSessionState } from '../engine/useGameSession';

interface GameContainerProps {
  title: string;
  category: string;
  instructions: string;
  skillsPracticed: string[];
  session: {
    state: GameSessionState;
    pauseGame: () => void;
    resumeGame: () => void;
    restartGame: () => void;
  };
  children: React.ReactNode;
  onPlayAgain?: () => void;
}

export function GameContainer({
  title,
  category,
  instructions,
  skillsPracticed,
  session,
  children,
  onPlayAgain,
}: GameContainerProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const soundEnabled = useAccessibilityStore((s) => s.soundEffectsEnabled);
  const setSoundEffects = useAccessibilityStore((s) => s.setSoundEffects);

  const { state, pauseGame, resumeGame, restartGame } = session;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Game Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/app/games">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-xs">
              <ArrowLeft className="w-4 h-4" /> Games Hub
            </Button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div>
            <h1 className="text-lg font-bold font-sans text-foreground leading-none">{title}</h1>
            <span className="text-xs text-primary font-semibold">{category}</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Gentle Duration */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-xs font-semibold text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(state.durationSeconds)}</span>
          </div>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEffects(!soundEnabled)}
            className="rounded-xl text-muted-foreground hover:text-foreground"
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-peach-500" />}
          </Button>

          {/* Instructions Modal Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstructions(true)}
            className="rounded-xl gap-1 text-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">How to Play</span>
          </Button>

          {/* Pause / Resume */}
          {state.status === 'STARTED' ? (
            <Button variant="outline" size="sm" onClick={pauseGame} className="rounded-xl gap-1 text-xs">
              <Pause className="w-3.5 h-3.5" /> Pause
            </Button>
          ) : state.status === 'PAUSED' ? (
            <Button variant="primary" size="sm" onClick={resumeGame} className="rounded-xl gap-1 text-xs">
              <Play className="w-3.5 h-3.5" /> Resume
            </Button>
          ) : null}

          {/* Restart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              restartGame();
              if (onPlayAgain) onPlayAgain();
            }}
            className="rounded-xl text-muted-foreground hover:text-foreground"
            title="Restart Activity"
            aria-label="Restart Activity"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Game Screen Stage */}
      <div className="relative rounded-3xl border border-border bg-card p-4 sm:p-8 min-h-[460px] flex flex-col justify-center items-center shadow-sm overflow-hidden">
        {/* Paused Overlay */}
        {state.status === 'PAUSED' && (
          <div className="absolute inset-0 z-30 bg-ink-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white space-y-4 animate-in fade-in-50">
            <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center text-3xl">
              ⏸️
            </div>
            <h2 className="text-2xl font-bold font-sans">Activity Paused</h2>
            <p className="text-sm text-cream-200 text-center max-w-sm font-reading">
              Take a breath and continue whenever you feel ready.
            </p>
            <Button onClick={resumeGame} size="lg" className="gap-2 font-bold">
              <Play className="w-5 h-5" /> Resume Activity
            </Button>
          </div>
        )}

        {/* Playable Game Component */}
        <div className="w-full flex justify-center items-center">
          {children}
        </div>
      </div>

      {/* Skills Practiced Pill bar */}
      <div className="flex flex-wrap items-center gap-2 px-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Skills Practiced:</span>
        {skillsPracticed.map((skill) => (
          <span key={skill} className="px-2.5 py-1 rounded-full bg-cream-200 text-ink-900 font-medium">
            {skill}
          </span>
        ))}
      </div>

      {/* Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1">
              <HelpCircle className="w-4 h-4" /> Activity Instructions
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-sm pt-2 text-foreground font-reading leading-relaxed">
              {instructions}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setShowInstructions(false)}>
              Got It, Let's Play
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Modal */}
      <Dialog open={state.status === 'COMPLETED'}>
        <DialogContent className="max-w-md text-center">
          <div className="space-y-4 pt-2">
            <div className="w-16 h-16 rounded-3xl bg-sage-100 text-primary flex items-center justify-center text-3xl mx-auto shadow-sm">
              ✨
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Wonderful Exploration!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1 font-reading">
                You completed this session calmly and thoughtfully.
              </DialogDescription>
            </div>

            {/* Performance reflection */}
            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-cream-100 border border-border text-xs">
              <div>
                <div className="text-muted-foreground">Duration</div>
                <div className="font-bold text-sm text-foreground mt-0.5">{formatTime(state.durationSeconds)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Attempts</div>
                <div className="font-bold text-sm text-foreground mt-0.5">{state.attempts}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Matched / Solved</div>
                <div className="font-bold text-sm text-primary mt-0.5">{state.correctCount}</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              "Progress is about exploration and curiosity, not perfection."
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 gap-1.5"
                onClick={() => {
                  restartGame();
                  if (onPlayAgain) onPlayAgain();
                }}
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
              <Link to="/app/games" className="flex-1">
                <Button className="w-full gap-1.5">
                  Explore More Games →
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
