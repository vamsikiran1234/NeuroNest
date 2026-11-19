import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Check, Sparkles, HelpCircle } from 'lucide-react';

interface FocusScene {
  targetName: string;
  targetEmoji: string;
  requiredCount: number;
  instruction: string;
  gridItems: { id: string; emoji: string; isTarget: boolean }[];
}

const FOCUS_SCENES: FocusScene[] = [
  {
    targetName: 'Sleepy Snails',
    targetEmoji: '🐌',
    requiredCount: 3,
    instruction: 'Gently look around the garden to find all 3 sleepy snails resting among the greenery.',
    gridItems: [
      { id: '1', emoji: '🌿', isTarget: false },
      { id: '2', emoji: '🐌', isTarget: true },
      { id: '3', emoji: '🍃', isTarget: false },
      { id: '4', emoji: '🌸', isTarget: false },
      { id: '5', emoji: '🌼', isTarget: false },
      { id: '6', emoji: '🌿', isTarget: false },
      { id: '7', emoji: '🐌', isTarget: true },
      { id: '8', emoji: '🍄', isTarget: false },
      { id: '9', emoji: '☘️', isTarget: false },
      { id: '10', emoji: '🍃', isTarget: false },
      { id: '11', emoji: '🐌', isTarget: true },
      { id: '12', emoji: '🌻', isTarget: false },
    ],
  },
  {
    targetName: 'Golden Honeybees',
    targetEmoji: '🐝',
    requiredCount: 4,
    instruction: 'Find the 4 busy bees pollinating the gentle wildflower meadow.',
    gridItems: [
      { id: '1', emoji: '🌷', isTarget: false },
      { id: '2', emoji: '🐝', isTarget: true },
      { id: '3', emoji: '🌺', isTarget: false },
      { id: '4', emoji: '🐝', isTarget: true },
      { id: '5', emoji: '🌹', isTarget: false },
      { id: '6', emoji: '🌻', isTarget: false },
      { id: '7', emoji: '🐝', isTarget: true },
      { id: '8', emoji: '🌱', isTarget: false },
      { id: '9', emoji: '🌷', isTarget: false },
      { id: '10', emoji: '🐝', isTarget: true },
      { id: '11', emoji: '🌼', isTarget: false },
      { id: '12', emoji: '🌸', isTarget: false },
    ],
  },
  {
    targetName: 'Lucky Four-Leaf Clovers',
    targetEmoji: '🍀',
    requiredCount: 3,
    instruction: 'Spot the 3 special four-leaf clovers hidden among the forest flora.',
    gridItems: [
      { id: '1', emoji: '☘️', isTarget: false },
      { id: '2', emoji: '☘️', isTarget: false },
      { id: '3', emoji: '🍀', isTarget: true },
      { id: '4', emoji: '🌱', isTarget: false },
      { id: '5', emoji: '🍀', isTarget: true },
      { id: '6', emoji: '☘️', isTarget: false },
      { id: '7', emoji: '🌿', isTarget: false },
      { id: '8', emoji: '☘️', isTarget: false },
      { id: '9', emoji: '🍀', isTarget: true },
      { id: '10', emoji: '🍃', isTarget: false },
      { id: '11', emoji: '☘️', isTarget: false },
      { id: '12', emoji: '🌱', isTarget: false },
    ],
  },
];

export function FocusGarden() {
  const session = useGameSession('focus-garden', 'BEGINNER');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [hintActive, setHintActive] = useState(false);

  useEffect(() => {
    session.startSession();
  }, []);

  const scene = FOCUS_SCENES[currentIdx];
  const isSceneComplete = foundIds.length === scene.requiredCount;

  const handleItemClick = (item: { id: string; emoji: string; isTarget: boolean }) => {
    if (foundIds.includes(item.id)) return;

    if (item.isTarget) {
      const updated = [...foundIds, item.id];
      setFoundIds(updated);
      session.recordAttempt(true, 20);

      if (updated.length === scene.requiredCount) {
        if (currentIdx === FOCUS_SCENES.length - 1) {
          session.completeGame('Mastered selective attention and visual focus across all garden scenes!');
        }
      }
    } else {
      // Gentle feedback: not a penalty, encourages looking closer
      session.recordAttempt(false, 2);
    }
  };

  const handleHint = () => {
    setHintActive(true);
    setTimeout(() => setHintActive(false), 2000);
  };

  const handleNextScene = () => {
    if (currentIdx < FOCUS_SCENES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setFoundIds([]);
      setHintActive(false);
    } else {
      session.completeGame('Magnificent focus! You discovered every hidden treasure.');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setFoundIds([]);
    setHintActive(false);
    session.startSession();
  };

  return (
    <GameContainer
      title="Focus Garden"
      category="Focus & Attention"
      instructions="Practice visual attention by discovering specific items hidden across peaceful natural scenes. Take all the time you need; hints are always available."
      skillsPracticed={['Selective Attention', 'Visual Scanning', 'Detail Orientation']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6 text-center">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span>Scene {currentIdx + 1} of {FOCUS_SCENES.length}</span>
          <span className="flex items-center gap-1.5 bg-sage-50 text-sage-800 px-3 py-1 rounded-full border border-sage-200">
            Target: <span className="text-base">{scene.targetEmoji}</span> {foundIds.length}/{scene.requiredCount} Found
          </span>
        </div>

        <p className="text-base font-bold text-foreground font-reading">
          {scene.instruction}
        </p>

        {/* Garden Scene Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 p-6 rounded-3xl bg-cream-100 border border-border">
          {scene.gridItems.map((item) => {
            const isFound = foundIds.includes(item.id);
            const isHinted = hintActive && item.isTarget && !isFound;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={isFound}
                aria-label={`Inspect ${item.emoji}`}
                className={`relative h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-200 select-none ${
                  isFound
                    ? 'bg-sage-100 border-2 border-sage-400 scale-95 opacity-80'
                    : isHinted
                    ? 'bg-peach-100 border-2 border-peach-400 animate-pulse scale-105'
                    : 'bg-white hover:bg-cream-50 border border-border hover:shadow-md active:scale-95'
                }`}
              >
                <span>{item.emoji}</span>
                {isFound && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sage-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions & Feedback */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleHint}
            disabled={isSceneComplete || hintActive}
            className="flex items-center gap-2 text-xs"
          >
            <HelpCircle className="w-4 h-4 text-peach-600" />
            Gentle Hint
          </Button>

          {isSceneComplete && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <span className="text-sm font-bold text-sage-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> All found!
              </span>
              <Button onClick={handleNextScene} size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                {currentIdx < FOCUS_SCENES.length - 1 ? 'Next Scene →' : 'Complete Game ✨'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </GameContainer>
  );
}
