import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Check, Sparkles, HelpCircle } from 'lucide-react';

interface PatternPuzzle {
  id: string;
  sequence: string[];
  options: string[];
  correctAnswer: string;
  ruleExplanation: string;
}

const PATTERN_PUZZLES: PatternPuzzle[] = [
  {
    id: 'p1',
    sequence: ['🟡', '🔷', '🟡', '🔷', '🟡', '?'],
    options: ['🔷', '🟡', '🔺', '⭐'],
    correctAnswer: '🔷',
    ruleExplanation: 'Alternating shape pattern: yellow circle followed by blue diamond.',
  },
  {
    id: 'p2',
    sequence: ['🌸', '🌸', '🌿', '🌸', '🌸', '?'],
    options: ['🌿', '🌸', '🍄', '🌻'],
    correctAnswer: '🌿',
    ruleExplanation: 'Two blossoms followed by one leafy branch.',
  },
  {
    id: 'p3',
    sequence: ['🌙', '⭐', '⭐', '🌙', '⭐', '?'],
    options: ['⭐', '🌙', '☀️', '☁️'],
    correctAnswer: '⭐',
    ruleExplanation: 'One crescent moon followed by two shimmering stars.',
  },
  {
    id: 'p4',
    sequence: ['🍎', '🍐', '🍊', '🍎', '🍐', '?'],
    options: ['🍊', '🍎', '🍇', '🍒'],
    correctAnswer: '🍊',
    ruleExplanation: 'Three-fruit sequence in order: Apple, Pear, then Orange.',
  },
];

export function PatternDetective() {
  const session = useGameSession('pattern-detective', 'INTERMEDIATE');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    session.startSession();
  }, []);

  const puzzle = PATTERN_PUZZLES[currentIdx];

  const handleSelect = (choice: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const correct = choice === puzzle.correctAnswer;
    setIsAnswerCorrect(correct);
    session.recordAttempt(correct, correct ? 25 : 5);
  };

  const handleNext = () => {
    if (currentIdx < PATTERN_PUZZLES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      session.completeGame('Mastered deductive pattern logic and sequence discovery!');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    session.startSession();
  };

  return (
    <GameContainer
      title="Pattern Detective"
      category="Numbers & Logic"
      instructions="Examine the sequence clue carefully and deduce what symbol comes next in the pattern. Take your time to discover the rhythm."
      skillsPracticed={['Pattern Recognition', 'Logical Deduction', 'Sequential Processing']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6 text-center">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Mystery Case {currentIdx + 1} of {PATTERN_PUZZLES.length}
        </div>

        <p className="text-base font-bold text-foreground font-reading">
          What symbol comes next to complete the pattern?
        </p>

        {/* Pattern Ribbon */}
        <div className="p-6 rounded-3xl bg-cream-100 border border-border flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto min-h-[140px]">
          {puzzle.sequence.map((sym, i) => (
            <div
              key={i}
              className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xs transition-transform ${
                sym === '?'
                  ? selectedAnswer
                    ? isAnswerCorrect
                      ? 'bg-sage-100 border-2 border-sage-500 text-sage-800'
                      : 'bg-peach-100 border-2 border-peach-500 text-peach-800'
                    : 'bg-white border-2 border-dashed border-dusty-400 text-dusty-600 animate-pulse'
                  : 'bg-white border border-border'
              }`}
            >
              {sym === '?' ? (selectedAnswer ? selectedAnswer : '?') : sym}
            </div>
          ))}
        </div>

        {/* Choice Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {puzzle.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === puzzle.correctAnswer;

            let btnVariant: 'outline' | 'default' = 'outline';
            let extraClasses = 'bg-white hover:bg-cream-50 text-3xl py-6';

            if (selectedAnswer !== null) {
              if (isCorrectOption) {
                extraClasses = 'bg-sage-100 border-2 border-sage-500 text-sage-800 text-3xl py-6';
              } else if (isSelected) {
                extraClasses = 'bg-peach-100 border-2 border-peach-400 text-peach-800 text-3xl py-6 opacity-75';
              } else {
                extraClasses = 'bg-white opacity-40 text-3xl py-6';
              }
            }

            return (
              <Button
                key={option}
                variant={btnVariant}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(option)}
                className={`rounded-2xl transition-all h-20 ${extraClasses}`}
                aria-label={`Select ${option}`}
              >
                {option}
              </Button>
            );
          })}
        </div>

        {/* Feedback Ribbon */}
        {selectedAnswer !== null && (
          <div
            className={`p-4 rounded-2xl border text-sm font-reading text-left space-y-1 animate-in fade-in slide-in-from-bottom-2 ${
              isAnswerCorrect
                ? 'bg-sage-50 border-sage-200 text-sage-900'
                : 'bg-cream-50 border-border text-foreground'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {isAnswerCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-sage-600" />
                  Brilliant deduction!
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-dusty-600" />
                  Good detective thinking! Let's explore why:
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{puzzle.ruleExplanation}</p>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleNext} size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                {currentIdx < PATTERN_PUZZLES.length - 1 ? 'Next Mystery Case →' : 'Complete Detective Training ✨'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
}
