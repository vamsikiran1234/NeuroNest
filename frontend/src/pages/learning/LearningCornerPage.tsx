import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface Article {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  summary: string;
  originalText: string;
  simplifiedText: string;
  readingLevel: string;
  estimatedMinutes: number;
  keyTerms: { term: string; explanation: string }[];
}

const ARTICLES: Article[] = [
  {
    id: 'a1',
    category: 'SCIENCE_NATURE',
    categoryName: 'Science & Nature',
    title: 'The Secrets of the Honeybee Dance',
    summary: 'Discover how honeybees use a figure-eight waggle dance to tell hive members exactly where to find sweet wildflower nectar.',
    originalText: `Inside a dark honeybee hive, visual sight is limited, yet worker bees coordinate foraging with incredible mathematical precision. When a scout honeybee finds a rich meadow of blossoming wildflowers, she flies back to the hive and performs what biologists call the "waggle dance."

During this dance, the bee runs in a figure-eight pattern on the honeycomb. The angle of her run in relation to gravity indicates the exact angle toward the flower patch relative to the sun. Furthermore, the duration of her abdomen vibration corresponds directly to distance: every second of waggling signals approximately one kilometer of flight distance.

By gathering closely and feeling the vibrations through their sensitive antennae and legs, neighboring bees decode this choreography and fly straight to the blossoming food source without ever being led individually.`,
    simplifiedText: `Honeybees have a special way of talking to each other without words!

When a bee discovers a lovely field of flowers, it flies home to its hive and does a happy wiggle dance shaped like the number 8.

Here is how the dance works:
1. Direction: The angle the bee dances shows which direction to fly toward the sun.
2. Distance: How long the bee wiggles its tummy tells the other bees how far away the flowers are (1 second = about 1 kilometer).

Other bees touch the dancer with their antennae to feel the rhythm. Then they fly right to the flowers to collect sweet nectar!`,
    readingLevel: 'Accessible',
    estimatedMinutes: 3,
    keyTerms: [
      { term: 'Waggle Dance', explanation: 'A figure-8 movement bees use to communicate directions.' },
      { term: 'Antennae', explanation: 'Sensory feelers on a bee\'s head used to sense touch and vibrations.' },
      { term: 'Nectar', explanation: 'Sweet liquid produced by flowers that bees turn into honey.' },
    ],
  },
  {
    id: 'a2',
    category: 'SCIENCE_NATURE',
    categoryName: 'Science & Nature',
    title: 'The Whispering Forest: How Trees Communicate',
    summary: 'Beneath the forest soil lies an ancient web of fungal threads that allows trees to share nutrients and send helpful warning signals.',
    originalText: `When walking through a quiet forest, trees might seem like solitary beings standing quietly side by side. However, beneath the moss and damp earth lies a vast biological internet known as mycorrhizal networks, nicknamed the "Wood Wide Web."

Microscopic fungi connect their thread-like filaments (called hyphae) directly into tree roots. The fungi cannot perform photosynthesis, so the trees provide them with energy-rich sugars. In return, the fungal threads extend for miles, gathering water, phosphorus, and nitrogen that tree roots could never reach on their own.

Even more remarkably, trees use this network to support one another. Older "mother trees" send extra nourishment to young saplings shaded by the tall canopy. If pests or insects attack a tree, it sends biochemical warning pulses through the fungal network, prompting neighboring trees to produce protective leaf tannins before the pests arrive.`,
    simplifiedText: `Trees in the forest are actually great friends that help each other out!

Under the ground, tiny mushroom threads connect the roots of different trees like a cozy underground web.

What trees and fungi do together:
1. Sharing Food: Big trees share sweet sugars with young little trees that cannot reach enough sunlight yet.
2. Sending Water & Minerals: The fungal threads drink water deep in the ground and pass it up to thirsty trees.
3. Helpful Warnings: If a bug starts nibbling leaves on one tree, it sends a gentle message through the roots so neighboring trees can protect themselves.

The forest works as one big, supportive team!`,
    readingLevel: 'Accessible',
    estimatedMinutes: 4,
    keyTerms: [
      { term: 'Mycorrhiza', explanation: 'A helpful friendship between plant roots and friendly soil fungi.' },
      { term: 'Photosynthesis', explanation: 'How green plants turn sunlight, air, and water into food.' },
      { term: 'Hyphae', explanation: 'Ultra-fine thread-like fibers of fungi spreading through the earth.' },
    ],
  },
  {
    id: 'a3',
    category: 'SPACE_EXPLORATION',
    categoryName: 'Space & Planets',
    title: 'The Gentle Giant: Exploring Jupiter',
    summary: 'Learn about Jupiter, the largest planet in our solar system, with its swirling storms and cosmic shield protecting Earth.',
    originalText: `Jupiter is the undisputed king of our planetary system, possessing more than twice the mass of all other solar planets combined. It is a gas giant composed primarily of hydrogen and helium, without a solid surface upon which an astronaut could stand.

One of Jupiter's most famous features is the Great Red Spot—a colossal anticyclonic storm that has raged for at least 350 years and is large enough to engulf the entire Earth. Jupiter also hosts an incredible family of 95 recognized moons, including Ganymede (the largest moon in our solar system) and Europa (an icy world with a deep subterranean ocean).

Beyond its beauty, Jupiter plays a vital protective role in our solar neighborhood. Its immense gravitational field acts like a gigantic cosmic vacuum cleaner, attracting or deflecting incoming comets and asteroids that might otherwise collide with Earth.`,
    simplifiedText: `Jupiter is the biggest planet in our entire solar system!

Fun facts about Jupiter:
1. Gas Giant: Jupiter is made of swirling gases and clouds, so there is no hard ground to walk on.
2. The Great Red Spot: A giant, swirling spinning storm that has been going on for hundreds of years.
3. Moon Family: Jupiter has 95 moons orbiting around it! One of them, Europa, has a huge ocean hidden under smooth ice.
4. Earth's Gentle Protector: Because Jupiter is so huge, its gravity pulls dangerous wandering space rocks toward itself, keeping Earth safe and peaceful.`,
    readingLevel: 'Accessible',
    estimatedMinutes: 3,
    keyTerms: [
      { term: 'Gas Giant', explanation: 'A large planet made mostly of swirling gases rather than rock.' },
      { term: 'Great Red Spot', explanation: 'A massive storm on Jupiter that is bigger than planet Earth.' },
      { term: 'Subterranean', explanation: 'Located deep beneath the crust or surface of a world.' },
    ],
  },
  {
    id: 'a4',
    category: 'EVERYDAY_SCIENCE',
    categoryName: 'Everyday Science',
    title: 'Why Do We Need Sleep and Dreams?',
    summary: 'Discover how our brains tidy up memories, repair our bodies, and play creative dream movies every single night.',
    originalText: `Sleep is not simply a period of turning off like an electric light switch. In fact, our brain is extraordinarily active while we rest. Every night, our sleep cycles through different phases, including deep restorative slow-wave sleep and Rapid Eye Movement (REM) sleep.

During deep sleep, the brain's glymphatic system washes away cellular waste products that accumulate throughout the busy day, while growth hormones work to repair muscles and tissues.

During REM sleep, our brain reviews the day's events, moving important facts and emotional lessons from short-term holding into long-term memory banks. This memory consolidation process often sparks dreams—vivid mental stories that allow our mind to practice scenarios, process feelings, and recharge creative thinking.`,
    simplifiedText: `Going to sleep is like your brain's cozy nighttime superpower!

Here is what happens while you are sleeping:
1. Brain Tidy-Up: Just like cleaning up toys after a fun day, your brain cleans away tired chemicals and organizes your thoughts.
2. Memory Saving: Your mind moves things you learned today into your long-term memory chest so you remember them tomorrow.
3. Body Rest: Muscles relax and grow stronger.
4. Colorful Dreams: Dreams are your brain's creative movie theater, helping you process feelings and wake up refreshed.`,
    readingLevel: 'Accessible',
    estimatedMinutes: 3,
    keyTerms: [
      { term: 'REM Sleep', explanation: 'A dream-rich sleep stage where eyes move quickly behind closed lids.' },
      { term: 'Consolidation', explanation: 'Stabilizing and storing new memories so they stay with you.' },
      { term: 'Restorative', explanation: 'Healing, refreshing, and bringing back fresh physical energy.' },
    ],
  },
];

const CATEGORIES = ['ALL', 'SCIENCE_NATURE', 'SPACE_EXPLORATION', 'EVERYDAY_SCIENCE'];

export function LearningCornerPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neuronest_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSave = (id: string) => {
    const updated = savedIds.includes(id) ? savedIds.filter((x) => x !== id) : [...savedIds, id];
    setSavedIds(updated);
    try {
      localStorage.setItem('neuronest_saved_articles', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCloseReader = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveArticle(null);
  };

  const filtered = ARTICLES.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-lavender-50 to-sage-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-lavender-200 text-xs font-bold text-lavender-800">
            <BookOpen className="w-3.5 h-3.5" />
            Accessible Knowledge
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Learning Corner
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            Fascinating topics broken into clear, digestible sections with optional simplified mode, vocabulary helpers, and integrated read-aloud audio.
          </p>
        </div>
      </div>

      {/* Controls: Search & Category Pills */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stories, science, nature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
                selectedCategory === cat
                  ? 'bg-lavender-600 text-white border-lavender-600 font-bold shadow-xs'
                  : 'bg-white text-foreground border-border hover:bg-cream-50'
              }`}
            >
              {cat === 'ALL'
                ? 'All Topics'
                : cat === 'SCIENCE_NATURE'
                ? 'Science & Nature'
                : cat === 'SPACE_EXPLORATION'
                ? 'Space & Planets'
                : 'Everyday Science'}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((article) => {
          const isSaved = savedIds.includes(article.id);

          return (
            <Card
              key={article.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border-border bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cream-100 text-muted-foreground border border-border">
                    {article.categoryName}
                  </span>
                  <button
                    onClick={() => toggleSave(article.id)}
                    aria-label={`Bookmark ${article.title}`}
                    className={`p-1.5 rounded-full transition-colors ${
                      isSaved
                        ? 'text-lavender-600 bg-lavender-50'
                        : 'text-muted-foreground hover:text-lavender-600 hover:bg-cream-100'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-lavender-600' : ''}`} />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground hover:text-lavender-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 font-reading leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Key Term Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.keyTerms.map((term) => (
                    <span
                      key={term.term}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cream-50 text-foreground border border-border"
                    >
                      {term.term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 bg-cream-50/60 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{article.estimatedMinutes} min read</span>
                </div>

                <Button
                  onClick={() => {
                    setActiveArticle(article);
                    setIsSpeaking(false);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  size="sm"
                  className="bg-lavender-600 hover:bg-lavender-700 text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Read Story
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Accessible Reader View Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-border max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between bg-cream-50/70">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-lavender-700 uppercase tracking-wider">
                  {activeArticle.categoryName}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={handleCloseReader}
                className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-foreground font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Reading Toolbar */}
            <div className="px-5 py-3 border-b border-border bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted-foreground">Mode:</span>
                <button
                  onClick={() => setIsSimplifiedMode(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    isSimplifiedMode ? 'bg-sage-600 text-white shadow-xs' : 'bg-cream-100 text-foreground hover:bg-cream-200'
                  }`}
                >
                  ✨ Simplified
                </button>
                <button
                  onClick={() => setIsSimplifiedMode(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    !isSimplifiedMode ? 'bg-dusty-600 text-white shadow-xs' : 'bg-cream-100 text-foreground hover:bg-cream-200'
                  }`}
                >
                  Standard
                </button>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleSpeak(isSimplifiedMode ? activeArticle.simplifiedText : activeArticle.originalText)
                  }
                  className="flex items-center gap-1.5 text-xs text-lavender-800"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-peach-600" /> Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-lavender-600" /> Read to Me
                    </>
                  )}
                </Button>

                <select
                  aria-label="Reading Speed"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-border bg-cream-50 text-xs font-medium"
                >
                  <option value={0.8}>0.8x Slow</option>
                  <option value={0.9}>0.9x Calm</option>
                  <option value={1.0}>1.0x Regular</option>
                </select>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 overflow-y-auto space-y-6 font-reading text-base leading-relaxed text-foreground">
              {isSimplifiedMode ? (
                <div className="p-4 rounded-2xl bg-sage-50/50 border border-sage-200/60 whitespace-pre-line">
                  {activeArticle.simplifiedText}
                </div>
              ) : (
                <div className="whitespace-pre-line space-y-4">{activeArticle.originalText}</div>
              )}

              {/* Vocabulary Callout */}
              <div className="p-4 rounded-2xl bg-cream-100 border border-border space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lavender-600" /> Helpful Vocabulary in this Story
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeArticle.keyTerms.map((term) => (
                    <div key={term.term} className="p-2.5 rounded-xl bg-white border border-border text-xs">
                      <span className="font-bold text-foreground block">{term.term}</span>
                      <span className="text-muted-foreground">{term.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-cream-50 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSave(activeArticle.id)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedIds.includes(activeArticle.id) ? 'fill-lavender-600 text-lavender-600' : ''}`} />
                {savedIds.includes(activeArticle.id) ? 'Saved in My Library' : 'Save for Later'}
              </Button>

              <Button onClick={handleCloseReader} size="sm" className="bg-lavender-600 hover:bg-lavender-700 text-white text-xs">
                Done Reading ✓
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
