import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Check, Sparkles } from 'lucide-react';

interface NumberPuzzle {
  type: 'COUNT' | 'COMPARE' | 'SUM';
  question: string;
  items: { emoji: string; count: number };
  secondItems?: { emoji: string; count: number };
  correctAnswer: number;
  options: number[];
}

const NUMBER_PUZZLES: NumberPuzzle[] = [
  {
    type: 'COUNT',
    question: 'How many golden butterflies are resting on the sunny garden leaves?',
    items: { emoji: '🦋', count: 6 },
    correctAnswer: 6,
    options: [4, 5, 6, 8],
  },
  {
    type: 'COMPARE',
    question: 'How many ripe apples are in the orchard basket?',
    items: { emoji: '🍎', count: 8 },
    correctAnswer: 8,
    options: [6, 7, 8, 9],
  },
  {
    type: 'SUM',
    question: 'If you combine 4 green clovers and 3 purple blossoms, how many are there in total?',
    items: { emoji: '🍀', count: 4 },
    secondItems: { emoji: '🌸', count: 3 },
    correctAnswer: 7,
    options: [6, 7, 8, 9],
  },
  {
    type: 'COUNT',
    question: 'Count the little ladybugs exploring the peaceful garden path:',
    items: { emoji: '🐞', count: 5 },
    correctAnswer: 5,
    options: [3, 4, 5, 6],
  },
];

export function NumberGarden() {
  const session = useGameSession('number-garden', 'BEGINNER');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    session.startSession();
  }, []);

  const puzzle = NUMBER_PUZZLES[currentIdx];

  const handleSelect = (choice: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const correct = choice === puzzle.correctAnswer;
    setIsAnswerCorrect(correct);
    session.recordAttempt(correct, correct ? 25 : 5);
  };

  const handleNext = () => {
    if (currentIdx < NUMBER_PUZZLES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      session.completeGame('Completed visual counting and gentle number garden puzzles!');
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
      title="Number Garden"
      category="Numbers & Logic"
      instructions="Count the visual objects in the garden scene and pick the matching number. There is no time countdown—touch each item as you count."
      skillsPracticed={['Visual Counting', 'Number Sense', 'Quantity Comparison']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6 text-center">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Exercise {currentIdx + 1} of {NUMBER_PUZZLES.length}
        </div>

        <p className="text-base font-bold text-foreground font-reading">
          {puzzle.question}
        </p>

        {/* Visual Counting Garden Scene */}
        <div className="p-6 rounded-3xl bg-cream-100 border border-border min-h-[170px] flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: puzzle.items.count }).map((_, i) => (
              <span
                key={`item-1-${i}`}
                className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-default select-none animate-in zoom-in-75 duration-150"
              >
                {puzzle.items.emoji}
              </span>
            ))}

            {puzzle.secondItems && (
              <>
                <span className="text-2xl font-bold text-muted-foreground px-2">+</span>
                {Array.from({ length: puzzle.secondItems.count }).map((_, i) => (
                  <span
                    key={`item-2-${i}`}
                    className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white shadow-sm transition-transform hover:scale-110 select-none animate-in zoom-in-75 duration-150"
                  >
                    {puzzle.secondItems?.emoji}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {puzzle.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isRight = opt === puzzle.correctAnswer;

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-2xl border-2 font-bold text-2xl font-sans transition-all ${
                    isSelected
                      ? isRight
                        ? 'border-primary bg-sage-100 text-primary ring-2 ring-primary'
                        : 'border-peach-300 bg-peach-50 text-peach-700'
                      : selectedAnswer !== null && isRight
                      ? 'border-primary bg-sage-50 text-primary'
                      : 'border-border bg-card hover:bg-cream-100 text-foreground'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="space-y-3 pt-2 animate-in fade-in-50">
              <div className="p-3 rounded-xl bg-white border border-border text-xs text-foreground font-semibold">
                {isAnswerCorrect ? (
                  <span className="text-primary flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" /> Exactly right! There are {puzzle.correctAnswer} in the garden.
                  </span>
                ) : (
                  <span>
                    Nice try! Counting them one by one shows there are {puzzle.correctAnswer}.
                  </span>
                )}
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                {currentIdx < NUMBER_PUZZLES.length - 1 ? 'Next Counting Exercise →' : 'Complete Number Garden ✨'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </GameContainer>
  );
}
