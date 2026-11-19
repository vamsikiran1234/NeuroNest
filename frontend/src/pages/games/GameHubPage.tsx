import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GAME_CATALOG, GameDefinition } from '../../features/games/registry/gameRegistry';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Sparkles, Clock, Heart, Filter, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Activities' },
  { id: 'MEMORY', label: 'Memory' },
  { id: 'EMOTION', label: 'Socio-Emotional' },
  { id: 'LANGUAGE', label: 'Language & Literacy' },
  { id: 'NUMBERS', label: 'Numbers & Logic' },
  { id: 'FOCUS', label: 'Focus & Attention' },
  { id: 'LIFE_SKILLS', label: 'Daily Life Skills' },
];

const DOMAIN_TAGS = ['All', 'ADHD', 'ASD', 'Dyslexia', 'Dyscalculia'];

export function GameHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neuronest_fav_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = favorites.includes(gameId)
      ? favorites.filter((id) => id !== gameId)
      : [...favorites, gameId];
    setFavorites(updated);
    try {
      localStorage.setItem('neuronest_fav_games', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const filteredGames = useMemo(() => {
    return GAME_CATALOG.filter((game) => {
      // Search filter
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'ALL' || game.category === selectedCategory;

      // Domain filter
      const matchesDomain =
        selectedDomain === 'All' ||
        game.targetDomains.some((d) => d.toLowerCase().includes(selectedDomain.toLowerCase()));

      return matchesSearch && matchesCategory && matchesDomain;
    });
  }, [searchQuery, selectedCategory, selectedDomain]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cream-100 via-sage-50 to-dusty-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sage-200 text-xs font-bold text-sage-800">
            <Sparkles className="w-3.5 h-3.5" />
            Inclusive Game Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Playful, Pressure-Free Learning
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            Every game is untimed by default, encouraging, and crafted for neurodiverse minds. Play at your rhythm with gentle feedback and visual clarity.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by game name, skill, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Neurodivergent Domain Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Focus:
            </span>
            {DOMAIN_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedDomain(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap ${
                  selectedDomain === tag
                    ? 'bg-sage-600 text-white border-sage-600 font-bold'
                    : 'bg-white text-muted-foreground border-border hover:bg-cream-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-dusty-600 text-white shadow-xs'
                  : 'bg-cream-100 text-foreground hover:bg-cream-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-dashed border-border space-y-3">
          <p className="text-base font-bold text-foreground">No games found matching your filters</p>
          <p className="text-xs text-muted-foreground">Try clearing the search text or selecting a different category.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedDomain('All');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const isFav = favorites.includes(game.id);

            return (
              <Card
                key={game.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border-border bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-6 space-y-4">
                  {/* Top Bar: Icon, Category & Favorite Button */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-cream-100 border border-border flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                      {game.iconEmoji}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${game.categoryColor}`}>
                        {game.categoryLabel.split('&')[0].trim()}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(e, game.id)}
                        aria-label={`Favorite ${game.title}`}
                        className={`p-1.5 rounded-full transition-colors ${
                          isFav
                            ? 'text-peach-600 bg-peach-50'
                            : 'text-muted-foreground hover:text-peach-500 hover:bg-cream-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-peach-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-sage-800 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 font-reading line-clamp-2">
                      {game.description}
                    </p>
                  </div>

                  {/* Skills & Domains */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.targetDomains.map((domain) => (
                      <span
                        key={domain}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cream-100 text-muted-foreground"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 py-4 bg-cream-50/70 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{game.estimatedMinutes} mins</span>
                  </div>

                  <Link to={`/app/games/${game.slug}`}>
                    <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl flex items-center gap-1 text-xs">
                      Play Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
