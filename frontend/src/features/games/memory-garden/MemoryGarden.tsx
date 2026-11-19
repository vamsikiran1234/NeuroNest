import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';

interface CardItem {
  id: number;
  pairId: number;
  symbol: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FLOWERS = [
  { symbol: '🌻', name: 'Sunflower' },
  { symbol: '🌸', name: 'Cherry Blossom' },
  { symbol: '🪷', name: 'Lotus' },
  { symbol: '🌿', name: 'Fern' },
  { symbol: '🌷', name: 'Tulip' },
  { symbol: '🍀', name: 'Clover' },
  { symbol: '🌹', name: 'Rose' },
  { symbol: '🌼', name: 'Daisy' },
];

export function MemoryGarden() {
  const session = useGameSession('memory-garden', 'BEGINNER');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [numPairs, setNumPairs] = useState(6); // 12 cards by default

  const initGame = (pairsCount = numPairs) => {
    const selectedFlowers = FLOWERS.slice(0, pairsCount);
    const deck: CardItem[] = [];

    selectedFlowers.forEach((flower, pairIdx) => {
      deck.push({
        id: pairIdx * 2,
        pairId: pairIdx,
        symbol: flower.symbol,
        name: flower.name,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: pairIdx * 2 + 1,
        pairId: pairIdx,
        symbol: flower.symbol,
        name: flower.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setSelectedIndices([]);
    setIsLocked(false);
    session.startSession();
  };

  useEffect(() => {
    initGame(numPairs);
  }, [numPairs]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (session.state.status === 'PAUSED') return;

    // Flip the clicked card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        session.recordAttempt(true, 20);
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards(newCards);
          setSelectedIndices([]);
          setIsLocked(false);

          // Check if all pairs are matched
          if (newCards.every((c) => c.isMatched)) {
            session.completeGame('All blooming flowers matched peacefully!');
          }
        }, 350);
      } else {
        // NO MATCH
        session.recordAttempt(false, 0);
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setSelectedIndices([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  return (
    <GameContainer
      title="Memory Garden"
      category="Memory & Thinking"
      instructions="Click or tap any two cards to reveal the flowers underneath. When you find a matching pair, they stay blooming in your garden. There are no timers or penalties—take all the time you need to explore and remember."
      skillsPracticed={['Working Memory', 'Visual Recall', 'Calm Pattern Recognition']}
      session={session}
      onPlayAgain={() => initGame(numPairs)}
    >
      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        {/* Grid size selector */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Garden Size:</span>
          <button
            onClick={() => setNumPairs(4)}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              numPairs === 4 ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border hover:bg-cream-100 text-foreground'
            }`}
          >
            4 Pairs (8 cards)
          </button>
          <button
            onClick={() => setNumPairs(6)}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              numPairs === 6 ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border hover:bg-cream-100 text-foreground'
            }`}
          >
            6 Pairs (12 cards)
          </button>
          <button
            onClick={() => setNumPairs(8)}
            className={`px-3 py-1 rounded-xl font-bold border transition-all ${
              numPairs === 8 ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card border-border hover:bg-cream-100 text-foreground'
            }`}
          >
            8 Pairs (16 cards)
          </button>
        </div>

        {/* Card Grid */}
        <div
          className={`grid gap-3 sm:gap-4 w-full ${
            numPairs === 4
              ? 'grid-cols-4 max-w-md'
              : numPairs === 6
              ? 'grid-cols-3 sm:grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-4'
          }`}
        >
          {cards.map((card, idx) => {
            const isOpen = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || isLocked}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-3xl sm:text-4xl transition-all duration-300 transform select-none ${
                  isOpen
                    ? card.isMatched
                      ? 'bg-sage-100/90 border-sage-300 shadow-sm scale-[0.98]'
                      : 'bg-white border-primary shadow-md scale-100'
                    : 'bg-cream-200/90 hover:bg-cream-300 border-border shadow-sm hover:scale-[1.03] active:scale-95'
                }`}
                aria-label={isOpen ? card.name : `Card ${idx + 1}, hidden`}
              >
                {isOpen ? (
                  <span className="animate-in zoom-in-75 duration-200">{card.symbol}</span>
                ) : (
                  <span className="text-xl text-ink-300/60 font-bold">🌱</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live matching counter */}
        <div className="text-xs text-muted-foreground font-semibold flex items-center gap-3">
          <span>Blooming Pairs: {session.state.correctCount} / {numPairs}</span>
          <span>•</span>
          <span>Attempts: {session.state.attempts}</span>
        </div>
      </div>
    </GameContainer>
  );
}
