import React, { useState, useEffect } from 'react';
import { GameContainer } from '../components/GameContainer';
import { useGameSession } from '../engine/useGameSession';
import { Button } from '../../../components/ui/Button';
import { Check, Sparkles, ShoppingBag, Backpack, CheckCircle2 } from 'lucide-react';

interface PackItem {
  id: string;
  name: string;
  emoji: string;
  isEssential: boolean;
}

const BACKPACK_ITEMS: PackItem[] = [
  { id: 'bp1', name: 'Fresh Water Bottle', emoji: '💧', isEssential: true },
  { id: 'bp2', name: 'Healthy Lunchbox', emoji: '🥪', isEssential: true },
  { id: 'bp3', name: 'Cozy Jacket', emoji: '🧥', isEssential: true },
  { id: 'bp4', name: 'Pocket Notebook', emoji: '📓', isEssential: true },
  { id: 'bp5', name: 'Heavy Microwave', emoji: '📻', isEssential: false },
  { id: 'bp6', name: 'Giant Bowling Ball', emoji: '🎳', isEssential: false },
  { id: 'bp7', name: 'Snow Shovel', emoji: '❄️', isEssential: false },
  { id: 'bp8', name: 'Garden Lawn Mower', emoji: '🚜', isEssential: false },
];

interface GroceryItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  onList: boolean;
}

const GROCERY_ITEMS: GroceryItem[] = [
  { id: 'g1', name: 'Fresh Bananas', emoji: '🍌', price: 2, onList: true },
  { id: 'g2', name: 'Oat Milk Carton', emoji: '🥛', price: 3, onList: true },
  { id: 'g3', name: 'Whole Grain Loaf', emoji: '🍞', price: 3, onList: true },
  { id: 'g4', name: 'Fancy Golden Candlestick', emoji: '🕯️', price: 25, onList: false },
  { id: 'g5', name: 'Diamond Ring', emoji: '💍', price: 80, onList: false },
  { id: 'g6', name: 'Crisp Red Apples', emoji: '🍎', price: 2, onList: false },
];

export function DailyLifeSimulator() {
  const session = useGameSession('daily-life-simulator', 'BEGINNER');
  const [scenario, setScenario] = useState<'BACKPACK' | 'GROCERY' | 'COMPLETE'>('BACKPACK');

  // Backpack state
  const [packedIds, setPackedIds] = useState<string[]>([]);
  const requiredBackpackIds = BACKPACK_ITEMS.filter((i) => i.isEssential).map((i) => i.id);
  const isBackpackDone = requiredBackpackIds.every((id) => packedIds.includes(id));

  // Grocery state
  const [cartIds, setCartIds] = useState<string[]>([]);
  const budget = 10;
  const currentTotal = cartIds.reduce((sum, id) => {
    const item = GROCERY_ITEMS.find((g) => g.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const requiredGroceryIds = GROCERY_ITEMS.filter((i) => i.onList).map((i) => i.id);
  const isGroceryDone = requiredGroceryIds.every((id) => cartIds.includes(id)) && currentTotal <= budget;

  useEffect(() => {
    session.startSession();
  }, []);

  const handleTogglePackItem = (item: PackItem) => {
    if (packedIds.includes(item.id)) {
      setPackedIds((prev) => prev.filter((id) => id !== item.id));
    } else {
      setPackedIds((prev) => [...prev, item.id]);
      session.recordAttempt(item.isEssential, item.isEssential ? 15 : 2);
    }
  };

  const handleNextToGrocery = () => {
    setScenario('GROCERY');
  };

  const handleToggleCartItem = (item: GroceryItem) => {
    if (cartIds.includes(item.id)) {
      setCartIds((prev) => prev.filter((id) => id !== item.id));
    } else {
      setCartIds((prev) => [...prev, item.id]);
      session.recordAttempt(item.onList, item.onList ? 15 : 2);
    }
  };

  const handleCompleteAll = () => {
    setScenario('COMPLETE');
    session.completeGame('Completed practical daily life organization and shopping challenges!');
  };

  const handleRestart = () => {
    setPackedIds([]);
    setCartIds([]);
    setScenario('BACKPACK');
    session.startSession();
  };

  return (
    <GameContainer
      title="Daily Life Simulator"
      category="Daily Living Skills"
      instructions="Practice everyday skills like packing essentials for an outing and navigating a calm shopping visit. Take your time to review what is practical and helpful."
      skillsPracticed={['Executive Function', 'Prioritization', 'Everyday Independence']}
      session={session}
      onPlayAgain={handleRestart}
    >
      <div className="w-full max-w-xl space-y-6">
        {/* Scenario Progress */}
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <span>
            {scenario === 'BACKPACK' && 'Mission 1 of 2: Packing Your Day Backpack'}
            {scenario === 'GROCERY' && 'Mission 2 of 2: Calm Neighborhood Grocery List'}
            {scenario === 'COMPLETE' && 'Daily Life Challenge Completed!'}
          </span>
          <span className="bg-sage-50 text-sage-800 px-2.5 py-0.5 rounded-full border border-sage-200">
            Life Skills Lab
          </span>
        </div>

        {/* MISSION 1: BACKPACK */}
        {scenario === 'BACKPACK' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-cream-100 border border-border flex items-center gap-3">
              <Backpack className="w-8 h-8 text-sage-600 flex-shrink-0" />
              <div className="text-left font-reading">
                <h4 className="font-bold text-sm text-foreground">Packing for a park day trip</h4>
                <p className="text-xs text-muted-foreground">
                  Select the 4 essential items (Water, Lunch, Jacket, Notebook) to pack into your bag.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BACKPACK_ITEMS.map((item) => {
                const isPacked = packedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTogglePackItem(item)}
                    className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 select-none ${
                      isPacked
                        ? item.isEssential
                          ? 'bg-sage-50 border-sage-500 shadow-xs'
                          : 'bg-peach-50 border-peach-400'
                        : 'bg-white hover:bg-cream-50 border-border hover:shadow-xs'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-foreground leading-tight">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {isPacked ? (item.isEssential ? '✓ Packed' : 'Not Needed') : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border flex items-center justify-between">
              <div className="text-xs font-medium text-foreground">
                Packed Essentials:{' '}
                <span className="font-bold text-sage-700">
                  {BACKPACK_ITEMS.filter((i) => i.isEssential && packedIds.includes(i.id)).length} / 4
                </span>
              </div>

              {isBackpackDone && (
                <Button
                  onClick={handleNextToGrocery}
                  size="sm"
                  className="bg-sage-600 hover:bg-sage-700 text-white flex items-center gap-1.5"
                >
                  Next Mission: Grocery Visit →
                </Button>
              )}
            </div>
          </div>
        )}

        {/* MISSION 2: GROCERY */}
        {scenario === 'GROCERY' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-cream-100 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <ShoppingBag className="w-7 h-7 text-dusty-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Shopping List: Bananas, Oat Milk, Bread</h4>
                  <p className="text-xs text-muted-foreground font-reading">
                    Budget: ${budget} | Total in Basket: ${currentTotal}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  currentTotal <= budget
                    ? 'bg-sage-100 text-sage-800 border-sage-300'
                    : 'bg-peach-100 text-peach-800 border-peach-300'
                }`}
              >
                ${budget - currentTotal >= 0 ? `$${budget - currentTotal} Left` : 'Over Budget'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GROCERY_ITEMS.map((item) => {
                const inCart = cartIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCartItem(item)}
                    className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 select-none ${
                      inCart
                        ? 'bg-dusty-50 border-dusty-500 shadow-xs'
                        : 'bg-white hover:bg-cream-50 border-border hover:shadow-xs'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-foreground leading-tight">{item.name}</span>
                    <span className="text-xs font-bold text-sage-700">${item.price}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {inCart ? '✓ In Basket' : '+ Pick Item'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-border flex items-center justify-between">
              <div className="text-xs font-medium text-foreground">
                List Items:{' '}
                <span className="font-bold text-sage-700">
                  {GROCERY_ITEMS.filter((i) => i.onList && cartIds.includes(i.id)).length} / 3
                </span>
              </div>

              {isGroceryDone && (
                <Button
                  onClick={handleCompleteAll}
                  size="sm"
                  className="bg-sage-600 hover:bg-sage-700 text-white flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Finish Shopping & Complete
                </Button>
              )}
            </div>
          </div>
        )}

        {/* MISSION COMPLETE */}
        {scenario === 'COMPLETE' && (
          <div className="p-8 rounded-3xl bg-white border border-border text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-full bg-sage-100 text-sage-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Everyday Independence Champion!</h3>
            <p className="text-sm text-muted-foreground font-reading max-w-md mx-auto">
              You packed all essential travel gear and smoothly navigated the grocery budget list. You are building confident real-life executive skills!
            </p>
            <div className="pt-2">
              <Button onClick={handleRestart} variant="outline" size="sm">
                Practice Missions Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
}
