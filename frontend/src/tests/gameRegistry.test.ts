import { describe, it, expect } from 'vitest';
import { GAME_CATALOG, getGameById } from '../features/games/registry/gameRegistry';

describe('Game Registry & Catalog', () => {
  it('contains exactly 8 unique educational games', () => {
    expect(GAME_CATALOG.length).toBe(8);

    const ids = GAME_CATALOG.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(8);
  });

  it('includes all 8 designated core games', () => {
    const requiredSlugs = [
      'memory-garden',
      'emotion-explorer',
      'word-builder',
      'number-garden',
      'focus-garden',
      'pattern-detective',
      'story-builder',
      'daily-life-simulator',
    ];

    for (const slug of requiredSlugs) {
      const found = getGameById(slug);
      expect(found).toBeDefined();
      expect(found?.title).toBeTruthy();
      expect(found?.component).toBeDefined();
      expect(found?.skills.length).toBeGreaterThan(0);
      expect(found?.targetDomains.length).toBeGreaterThan(0);
    }
  });

  it('provides supportive, non-punitive metadata for each game', () => {
    for (const game of GAME_CATALOG) {
      expect(game.category).toMatch(/^(MEMORY|EMOTION|LANGUAGE|NUMBERS|FOCUS|LIFE_SKILLS)$/);
      expect(game.estimatedMinutes).toBeGreaterThan(0);
      expect(game.iconEmoji).toBeTruthy();
      expect(game.description.length).toBeGreaterThan(20);
    }
  });
});
