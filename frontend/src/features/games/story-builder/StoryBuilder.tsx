import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Volume2, VolumeX, Sparkles, BookOpen, RefreshCw } from 'lucide-react';

interface StoryChoice {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const HEROES: StoryChoice[] = [
  { id: 'h1', emoji: '🦉', title: 'Barnaby the Owl', description: 'Curious, observant, and loves reading books under moonlit branches.' },
  { id: 'h2', emoji: '🦦', title: 'Maya the Otter', description: 'Inventive, playful, and crafts neat gadgets out of smooth river pebbles.' },
  { id: 'h3', emoji: '🐲', title: 'Pip the Little Dragon', description: 'Gentle and kind; instead of fire, breathes warm cinnamon sparkles.' },
  { id: 'h4', emoji: '☁️', title: 'Zephyr the Cloud', description: 'Calm and floating; changes shapes to help friends see things from new angles.' },
];

const SETTINGS: StoryChoice[] = [
  { id: 's1', emoji: '🌲', title: 'The Whispering Forest', description: 'Ancient mossy pines where soft breezes hum comforting melodies.' },
  { id: 's2', emoji: '📚', title: 'The Floating Library', description: 'A cozy sanctuary of wooden balconies and glowing paper lanterns.' },
  { id: 's3', emoji: '🪸', title: 'The Sunlit Lagoon', description: 'Warm crystalline waters where colorful schools of fish dance in circles.' },
  { id: 's4', emoji: '🔭', title: 'The Starlit Hilltop', description: 'A peaceful grassy ridge with brass telescopes pointing to constellations.' },
];

const CHALLENGES: StoryChoice[] = [
  { id: 'c1', emoji: '🎵', title: 'A Lost Melody', description: 'A mysterious lullaby whose last notes drifted away on the afternoon breeze.' },
  { id: 'c2', emoji: '🧩', title: 'An Ancient Clockwork Key', description: 'A golden puzzle box that requires patience and gentle curiosity to unlock.' },
  { id: 'c3', emoji: '🥧', title: 'A Starberry Recipe', description: 'A seasonal harvest treat meant to welcome neighbors to the neighborhood picnic.' },
  { id: 'c4', emoji: '🗺️', title: 'A Wandering Map', description: 'A parchment that changes its secret trails whenever someone giggles.' },
];

const RESOLUTIONS: StoryChoice[] = [
  { id: 'r1', emoji: '🤝', title: 'Gathering Friends to Brainstorm', description: 'Inviting woodland pals together to combine their distinct unique talents.' },
  { id: 'r2', emoji: '🔍', title: 'Step-by-Step Experimentation', description: 'Testing one kind idea at a time until the pieces fit into place.' },
  { id: 'r3', emoji: '🧘', title: 'Taking Calming Breaths & Listening', description: 'Pausing in stillness to notice the subtle clues everyone else missed.' },
  { id: 'r4', emoji: '🎨', title: 'Drawing a Creative Picture Map', description: 'Visualizing thoughts in colorful sketches until the solution becomes clear.' },
];

export function StoryBuilder() {
  const session = useGameSession('story-builder', 'BEGINNER');
  const [step, setStep] = useState<'HERO' | 'SETTING' | 'CHALLENGE' | 'RESOLUTION' | 'COMPLETE'>('HERO');
  const [selectedHero, setSelectedHero] = useState<StoryChoice | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<StoryChoice | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<StoryChoice | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<StoryChoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    session.startSession();
  }, []);

  const handleSelectHero = (hero: StoryChoice) => {
    setSelectedHero(hero);
    session.recordAttempt(true, 15);
    setStep('SETTING');
  };

  const handleSelectSetting = (setting: StoryChoice) => {
    setSelectedSetting(setting);
    session.recordAttempt(true, 15);
    setStep('CHALLENGE');
  };

  const handleSelectChallenge = (challenge: StoryChoice) => {
    setSelectedChallenge(challenge);
    session.recordAttempt(true, 15);
    setStep('RESOLUTION');
  };

  const handleSelectResolution = (res: StoryChoice) => {
    setSelectedResolution(res);
    session.recordAttempt(true, 20);
    setStep('COMPLETE');
    session.completeGame('Created an original, heartwarming story narrative!');
  };

  const getFullStoryText = () => {
    if (!selectedHero || !selectedSetting || !selectedChallenge || !selectedResolution) return '';
    return `Once upon a peaceful morning in ${selectedSetting.title}, ${selectedHero.title} was exploring their favorite spot. 
${selectedHero.description} 

While wandering through the surroundings, they encountered ${selectedChallenge.title.toLowerCase()}. ${selectedChallenge.description}

Rather than feeling overwhelmed, ${selectedHero.title} decided on a wonderful approach: ${selectedResolution.title.toLowerCase()}! 
Through ${selectedResolution.description.toLowerCase()}, every detail slowly fell into place. 

The entire community celebrated the heartwarming success, and ${selectedHero.title} felt proud, peaceful, and fulfilled.`;
  };

  const handleSpeakToggle = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(getFullStoryText());
      utterance.rate = 0.9; // Calm, deliberate reading speed
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleRestart = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedHero(null);
    setSelectedSetting(null);
    setSelectedChallenge(null);
    setSelectedResolution(null);
    setStep('HERO');
    session.startSession();
  };

  return (
    <GameContainer
      title="Story Builder"
      category="Communication & Language"
      instructions="Design your own heartwarming story by choosing a friendly hero, a cozy setting, an intriguing adventure, and a clever solution. There are no wrong choices!"
      skillsPracticed={['Narrative Sequencing', 'Expressive Language', 'Creative Agency']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span>
            {step === 'HERO' && 'Step 1: Choose Your Hero'}
            {step === 'SETTING' && 'Step 2: Choose The World'}
            {step === 'CHALLENGE' && 'Step 3: The Adventure'}
            {step === 'RESOLUTION' && 'Step 4: The Clever Solution'}
            {step === 'COMPLETE' && 'Your Story Is Ready!'}
          </span>
          {step !== 'COMPLETE' && (
            <span className="text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Interactive Storyteller
            </span>
          )}
        </div>

        {/* Step 1: HERO */}
        {step === 'HERO' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
            {HEROES.map((hero) => (
              <button
                key={hero.id}
                onClick={() => handleSelectHero(hero)}
                className="p-4 rounded-2xl bg-white hover:bg-cream-50 border border-border hover:border-sage-400 text-left transition-all hover:shadow-sm active:scale-98 flex items-start gap-3.5"
              >
                <span className="text-3xl p-2 rounded-xl bg-cream-100 flex-shrink-0">{hero.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{hero.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-reading">{hero.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: SETTING */}
        {step === 'SETTING' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
            {SETTINGS.map((setting) => (
              <button
                key={setting.id}
                onClick={() => handleSelectSetting(setting)}
                className="p-4 rounded-2xl bg-white hover:bg-cream-50 border border-border hover:border-dusty-400 text-left transition-all hover:shadow-sm active:scale-98 flex items-start gap-3.5"
              >
                <span className="text-3xl p-2 rounded-xl bg-cream-100 flex-shrink-0">{setting.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{setting.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-reading">{setting.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: CHALLENGE */}
        {step === 'CHALLENGE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
            {CHALLENGES.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => handleSelectChallenge(challenge)}
                className="p-4 rounded-2xl bg-white hover:bg-cream-50 border border-border hover:border-lavender-400 text-left transition-all hover:shadow-sm active:scale-98 flex items-start gap-3.5"
              >
                <span className="text-3xl p-2 rounded-xl bg-cream-100 flex-shrink-0">{challenge.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{challenge.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-reading">{challenge.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: RESOLUTION */}
        {step === 'RESOLUTION' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
            {RESOLUTIONS.map((res) => (
              <button
                key={res.id}
                onClick={() => handleSelectResolution(res)}
                className="p-4 rounded-2xl bg-white hover:bg-cream-50 border border-border hover:border-peach-400 text-left transition-all hover:shadow-sm active:scale-98 flex items-start gap-3.5"
              >
                <span className="text-3xl p-2 rounded-xl bg-cream-100 flex-shrink-0">{res.emoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{res.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-reading">{res.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Story Complete View */}
        {step === 'COMPLETE' && (
          <div className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sage-600" />
                <h3 className="font-bold text-base text-foreground">
                  The Tale of {selectedHero?.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSpeakToggle}
                  className="flex items-center gap-1.5 text-xs text-sage-800"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-peach-600" /> Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-sage-600" /> Read to Me
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-3xl py-2 bg-cream-50 rounded-2xl border border-border">
              <span>{selectedHero?.emoji}</span>
              <span>•</span>
              <span>{selectedSetting?.emoji}</span>
              <span>•</span>
              <span>{selectedChallenge?.emoji}</span>
              <span>•</span>
              <span>{selectedResolution?.emoji}</span>
            </div>

            <p className="text-sm text-foreground leading-relaxed font-reading whitespace-pre-line text-left">
              {getFullStoryText()}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="flex items-center gap-2 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Build Another Story
              </Button>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sage-700">
                <Sparkles className="w-4 h-4" /> Story saved to your journey
              </div>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
}
