import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { apiClient } from '../../../api/client';
import { soundManager } from './soundUtils';
import { useAccessibilityStore } from '../../../stores/accessibilityStore';

export interface GameSessionState {
  sessionId: string | null;
  status: 'IDLE' | 'STARTED' | 'PAUSED' | 'COMPLETED';
  durationSeconds: number;
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export function useGameSession(gameId: string, initialDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER') {
  const [state, setState] = useState<GameSessionState>({
    sessionId: null,
    status: 'IDLE',
    durationSeconds: 0,
    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    score: 0,
    difficulty: initialDifficulty,
  });

  const timerRef = useRef<any>(null);
  const soundEnabled = useAccessibilityStore((s) => s.soundEffectsEnabled);
  const soundVolume = useAccessibilityStore((s) => s.soundVolume) / 100;
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);

  // Initialize session with backend
  const startSession = useCallback(async (difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = initialDifficulty) => {
    try {
      const res = await apiClient.post<any>(`/games/${gameId}/sessions`, { difficulty });
      setState({
        sessionId: res.data?.id || `local-${Date.now()}`,
        status: 'STARTED',
        durationSeconds: 0,
        attempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        score: 0,
        difficulty,
      });
    } catch {
      // In offline / unauthenticated fallback mode, create local session
      setState({
        sessionId: `local-${Date.now()}`,
        status: 'STARTED',
        durationSeconds: 0,
        attempts: 0,
        correctCount: 0,
        incorrectCount: 0,
        score: 0,
        difficulty,
      });
    }
  }, [gameId, initialDifficulty]);

  // Timer loop
  useEffect(() => {
    if (state.status === 'STARTED') {
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status]);

  // Record an attempt
  const recordAttempt = useCallback((isCorrect: boolean, points = 10) => {
    if (soundEnabled) {
      if (isCorrect) {
        soundManager.playMatchSuccess(soundVolume);
      } else {
        soundManager.playCardFlip(soundVolume);
      }
    }

    setState((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      incorrectCount: !isCorrect ? prev.incorrectCount + 1 : prev.incorrectCount,
      score: isCorrect ? prev.score + points : prev.score,
    }));
  }, [soundEnabled, soundVolume]);

  const pauseGame = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'PAUSED' }));
  }, []);

  const resumeGame = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'STARTED' }));
  }, []);

  // Complete game
  const completeGame = useCallback(async (feedbackNotes = 'Completed peacefully') => {
    setState((prev) => ({ ...prev, status: 'COMPLETED' }));

    if (soundEnabled) {
      soundManager.playCompletionCelebration(soundVolume);
    }

    if (!reducedMotion) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#668A75', '#B8CDBB', '#C8BCE0', '#AFC7D8', '#E9BDA9'],
        });
      } catch {
        // ignore confetti errors
      }
    }

    // Submit results to backend if sessionId is present
    if (state.sessionId && !state.sessionId.startsWith('local-')) {
      try {
        await apiClient.post(`/games/sessions/${state.sessionId}/complete`, {
          durationSeconds: state.durationSeconds,
          attempts: state.attempts,
          correctCount: state.correctCount,
          incorrectCount: state.incorrectCount,
          score: state.score,
          feedbackNotes,
        });
      } catch {
        // Session completion persisted locally
      }
    }
  }, [state, soundEnabled, soundVolume, reducedMotion]);

  const restartGame = useCallback(() => {
    startSession(state.difficulty);
  }, [startSession, state.difficulty]);

  return {
    state,
    startSession,
    recordAttempt,
    pauseGame,
    resumeGame,
    completeGame,
    restartGame,
  };
}
