import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

interface Scenario {
  id: number;
  emoji: string;
  context: string;
  character: string;
  possibleFeelings: {
    label: string;
    isPrimary: boolean;
    explanation: string;
  }[];
  perspectiveInsight: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    emoji: '😌',
    character: 'Sam',
    context: 'Sam just finished organizing their art supplies into neat color-coded boxes after a busy school week.',
    possibleFeelings: [
      { label: 'Relieved & Peaceful', isPrimary: true, explanation: 'Having order in their creative space brings a sense of calm and accomplishment.' },
      { label: 'Overwhelmed', isPrimary: false, explanation: 'Sometimes organizing can be tiring, but Sam seems to be resting contentedly now.' },
      { label: 'Furious', isPrimary: false, explanation: 'Furious usually involves sharp energy or frustration, which doesn’t match Sam’s relaxed posture.' },
    ],
    perspectiveInsight: 'Many people experience peace when their environment feels predictable, while others find tidying exhausting. Both reactions are completely valid.',
  },
  {
    id: 2,
    emoji: '🤔',
    character: 'Jordan',
    context: 'Jordan was invited to a lively celebration with 30 classmates and is deciding whether to attend.',
    possibleFeelings: [
      { label: 'Hesitant & Reflective', isPrimary: true, explanation: 'Jordan is weighing the social energy required against their need for a quiet evening.' },
      { label: 'Thrilled', isPrimary: false, explanation: 'While high energy parties excite some, Jordan’s expression shows careful contemplation rather than immediate enthusiasm.' },
      { label: 'Panicked', isPrimary: false, explanation: 'Jordan looks thoughtful rather than distressed, taking time to decide what feels comfortable.' },
    ],
    perspectiveInsight: 'Taking time to pause before committing to high-sensory events is a healthy way to honor personal boundaries.',
  },
  {
    id: 3,
    emoji: '✨',
    character: 'Maya',
    context: 'Maya solved a complex coding puzzle that took three days of deep focus and trial-and-error.',
    possibleFeelings: [
      { label: 'Proud & Engaged', isPrimary: true, explanation: 'Sustained focus leading to a breakthrough creates deep personal satisfaction.' },
      { label: 'Bored', isPrimary: false, explanation: 'Boredom usually means lack of stimulation, whereas Maya was completely absorbed in the challenge.' },
      { label: 'Anxious', isPrimary: false, explanation: 'Anxiety involves anticipation of problems; Maya has just resolved the challenge.' },
    ],
    perspectiveInsight: 'Deep special interests and focused hyperfixation often bring moments of immense joy and clarity.',
  },
  {
    id: 4,
    emoji: '🎧',
    character: 'Kai',
    context: 'The shopping mall was filled with bright fluorescent lights and blaring speakers, so Kai put on noise-canceling headphones.',
    possibleFeelings: [
      { label: 'Protected & Calmer', isPrimary: true, explanation: 'Reducing sound sensory overload helps Kai’s nervous system regulate and feel safe.' },
      { label: 'Angry', isPrimary: false, explanation: 'Kai is actively taking care of their sensory comfort rather than expressing anger.' },
      { label: 'Energetic', isPrimary: false, explanation: 'Noise canceling headphones offer rest and relief rather than an adrenaline rush.' },
    ],
    perspectiveInsight: 'Sensory tools like headphones, sunglasses, or fidgets are wonderful supports for navigating overwhelming public spaces.',
  },
];

export function EmotionExplorer() {
  const session = useGameSession('emotion-explorer', 'BEGINNER');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [revealedExplanation, setRevealedExplanation] = useState<string | null>(null);

  useEffect(() => {
    session.startSession();
  }, []);

  const currentScenario = SCENARIOS[currentIndex];

  const handleSelect = (feeling: typeof currentScenario.possibleFeelings[0]) => {
    if (selectedFeeling) return; // already answered this card
    setSelectedFeeling(feeling.label);
    setRevealedExplanation(feeling.explanation);

    session.recordAttempt(feeling.isPrimary, feeling.isPrimary ? 25 : 10);
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedFeeling(null);
      setRevealedExplanation(null);
    } else {
      session.completeGame('Explored diverse emotional perspectives and social contexts.');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedFeeling(null);
    setRevealedExplanation(null);
    session.startSession();
  };

  return (
    <GameContainer
      title="Emotion Explorer"
      category="Emotional Awareness"
      instructions="Read the short story scene and look at how the person is reacting. Choose which feeling description resonates best. Remember: people experience and express emotions differently, and there is rarely only one universal reaction to any event."
      skillsPracticed={['Empathy', 'Contextual Reasoning', 'Diverse Perspectives']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6">
        {/* Progress indicator */}
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
          <span>Scenario {currentIndex + 1} of {SCENARIOS.length}</span>
          <span>{currentScenario.character}'s Experience</span>
        </div>

        {/* Character Card Scene */}
        <div className="p-6 rounded-3xl bg-cream-100 border border-border shadow-inner text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center text-5xl mx-auto">
            {currentScenario.emoji}
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {currentScenario.character}
          </h3>
          <p className="text-sm font-reading text-foreground/90 leading-relaxed max-w-md mx-auto">
            "{currentScenario.context}"
          </p>
        </div>

        {/* Possible feelings options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            How might {currentScenario.character} be feeling?
          </label>
          <div className="space-y-2">
            {currentScenario.possibleFeelings.map((feeling) => {
              const isSelected = selectedFeeling === feeling.label;
              return (
                <button
                  key={feeling.label}
                  onClick={() => handleSelect(feeling)}
                  disabled={!!selectedFeeling}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm font-semibold ${
                    isSelected
                      ? feeling.isPrimary
                        ? 'border-primary bg-sage-50 text-foreground ring-2 ring-primary/40'
                        : 'border-dustyBlue-300 bg-dustyBlue-50 text-foreground'
                      : selectedFeeling
                      ? 'border-border bg-card opacity-60'
                      : 'border-border bg-card hover:bg-cream-100 text-foreground'
                  }`}
                >
                  <span>{feeling.label}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation & Perspective Insight (Shown after selection) */}
        {selectedFeeling && (
          <div className="space-y-3 animate-in fade-in-50 duration-300">
            <div className="p-4 rounded-2xl bg-white border border-border text-xs leading-relaxed space-y-2">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Understanding this perspective:
              </div>
              <p className="text-foreground/85">{revealedExplanation}</p>
              <p className="text-muted-foreground italic border-t border-border/60 pt-2">
                Insight: {currentScenario.perspectiveInsight}
              </p>
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIndex < SCENARIOS.length - 1 ? 'Next Scenario →' : 'Complete Exploration ✨'}
            </Button>
          </div>
        )}
      </div>
    </GameContainer>
  );
}
