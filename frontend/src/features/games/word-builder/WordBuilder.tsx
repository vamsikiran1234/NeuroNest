import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Volume2, HelpCircle, Check, RotateCcw } from 'lucide-react';

interface WordPuzzle {
  word: string;
  hint: string;
  definition: string;
  category: string;
}

const PUZZLES: WordPuzzle[] = [
  { word: 'GARDEN', hint: 'A quiet green place where flowers and herbs grow', definition: 'A peaceful outdoor space of plants and blossoms', category: 'Nature' },
  { word: 'SPARK', hint: 'A tiny glowing flash of light or an inspiring idea', definition: 'A bright particle or the start of something creative', category: 'Energy' },
  { word: 'BREEZE', hint: 'A gentle, refreshing breath of wind on a sunny day', definition: 'A soft and pleasant current of air', category: 'Weather' },
  { word: 'HARMONY', hint: 'Different elements blending together peacefully', definition: 'A pleasing arrangement of parts or musical notes', category: 'Concepts' },
];

export function WordBuilder() {
  const session = useGameSession('word-builder', 'BEGINNER');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; letter: string }[]>([]);
  const [placedLetters, setPlacedLetters] = useState<{ id: string; letter: string }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isWordComplete, setIsWordComplete] = useState(false);

  const currentPuzzle = PUZZLES[currentIdx];

  const initPuzzle = (idx: number) => {
    const targetWord = PUZZLES[idx].word;
    const letters = targetWord.split('').map((l, i) => ({ id: `${l}-${i}-${Math.random()}`, letter: l }));

    // Shuffle letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    setAvailableLetters(letters);
    setPlacedLetters([]);
    setShowHint(false);
    setIsWordComplete(false);
  };

  useEffect(() => {
    initPuzzle(currentIdx);
    session.startSession();
  }, [currentIdx]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePickLetter = (item: { id: string; letter: string }) => {
    if (isWordComplete) return;

    const newPlaced = [...placedLetters, item];
    const newAvailable = availableLetters.filter((l) => l.id !== item.id);

    setPlacedLetters(newPlaced);
    setAvailableLetters(newAvailable);

    // Speak single letter phonics
    speak(item.letter);

    // If all letters placed, check word!
    if (newPlaced.length === currentPuzzle.word.length) {
      const built = newPlaced.map((p) => p.letter).join('');
      if (built === currentPuzzle.word) {
        setIsWordComplete(true);
        session.recordAttempt(true, 25);
        speak(currentPuzzle.word);
      } else {
        session.recordAttempt(false, 0);
      }
    }
  };

  const handleRemoveLetter = (item: { id: string; letter: string }) => {
    if (isWordComplete) return;

    setPlacedLetters(placedLetters.filter((l) => l.id !== item.id));
    setAvailableLetters([...availableLetters, item]);
  };

  const handleNextWord = () => {
    if (currentIdx < PUZZLES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      session.completeGame('Completed reading and spelling stepping stone puzzles!');
    }
  };

  return (
    <GameContainer
      title="Word Builder"
      category="Reading & Language"
      instructions="Tap or click the letter stones in the correct sequence to build the target word. You can hear pronunciation by clicking the speaker icon, or request an optional clue whenever you want."
      skillsPracticed={['Phonics', 'Spelling', 'Vocabulary Enrichment']}
      session={session}
      onPlayAgain={() => {
        setCurrentIdx(0);
        initPuzzle(0);
        session.startSession();
      }}
    >
      <div className="w-full max-w-xl space-y-6 text-center">
        {/* Category & Pronounce header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Puzzle {currentIdx + 1} of {PUZZLES.length} ({currentPuzzle.category})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => speak(currentPuzzle.word)}
            className="text-xs text-primary gap-1"
          >
            <Volume2 className="w-4 h-4" /> Listen to word
          </Button>
        </div>

        {/* Target word slots */}
        <div className="p-6 rounded-3xl bg-cream-100 border border-border min-h-[140px] flex flex-col items-center justify-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: currentPuzzle.word.length }).map((_, i) => {
              const placed = placedLetters[i];
              return (
                <button
                  key={i}
                  onClick={() => placed && handleRemoveLetter(placed)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-sans font-bold text-2xl transition-all ${
                    placed
                      ? isWordComplete
                        ? 'bg-sage-100 border-primary text-primary scale-105'
                        : 'bg-white border-border text-foreground hover:border-peach-300'
                      : 'border-dashed border-border bg-white/50 text-transparent'
                  }`}
                  aria-label={placed ? `Remove letter ${placed.letter}` : `Slot ${i + 1} empty`}
                >
                  {placed ? placed.letter : ''}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground">
            {isWordComplete ? (
              <span className="font-bold text-primary flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Word Completed!
              </span>
            ) : (
              <span>Tap a placed letter to return it to your tray</span>
            )}
          </div>
        </div>

        {/* Available Letters Tray */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">Letter Stepping Stones:</div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[60px]">
            {availableLetters.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickLetter(item)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white hover:bg-cream-100 border-2 border-border shadow-sm flex items-center justify-center font-sans font-bold text-xl text-ink-900 transition-all hover:scale-105 active:scale-95"
              >
                {item.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Hint and Definition */}
        <div className="space-y-3 pt-2">
          {!showHint && !isWordComplete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(true)}
              className="text-xs gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Need a clue?
            </Button>
          )}

          {(showHint || isWordComplete) && (
            <div className="p-3.5 rounded-2xl bg-white border border-border text-xs text-foreground/85 animate-in fade-in-50">
              <span className="font-bold text-primary">Clue: </span>
              {currentPuzzle.hint}
              {isWordComplete && (
                <div className="text-muted-foreground mt-1 border-t border-border pt-1">
                  Definition: {currentPuzzle.definition}
                </div>
              )}
            </div>
          )}

          {isWordComplete && (
            <Button onClick={handleNextWord} size="lg" className="w-full">
              {currentIdx < PUZZLES.length - 1 ? 'Next Word Puzzle →' : 'Finish Activity ✨'}
            </Button>
          )}
        </div>
      </div>
    </GameContainer>
  );
}
