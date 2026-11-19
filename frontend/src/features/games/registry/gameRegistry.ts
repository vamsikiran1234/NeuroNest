import React from 'react';
import { MemoryGarden } from '../memory-garden/MemoryGarden';
import { EmotionExplorer } from '../emotion-explorer/EmotionExplorer';
import { WordBuilder } from '../word-builder/WordBuilder';
import { NumberGarden } from '../number-garden/NumberGarden';
import { FocusGarden } from '../focus-garden/FocusGarden';
import { PatternDetective } from '../pattern-detective/PatternDetective';
import { StoryBuilder } from '../story-builder/StoryBuilder';
import { DailyLifeSimulator } from '../daily-life-simulator/DailyLifeSimulator';

export interface GameDefinition {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: 'MEMORY' | 'EMOTION' | 'LANGUAGE' | 'NUMBERS' | 'FOCUS' | 'LIFE_SKILLS';
  categoryLabel: string;
  categoryColor: string; // for tailwind badge/theme
  iconEmoji: string;
  targetDomains: string[];
  recommendedAge: string;
  estimatedMinutes: number;
  skills: string[];
  component: React.ComponentType;
}

export const GAME_CATALOG: GameDefinition[] = [
  {
    id: 'memory-garden',
    slug: 'memory-garden',
    title: 'Memory Garden',
    tagline: 'Pair calming nature cards at your own relaxed pace',
    description: 'Nurture working memory by gently uncovering pairs of peaceful garden symbols. Completely untimed with encouraging auditory feedback.',
    category: 'MEMORY',
    categoryLabel: 'Memory & Working Recall',
    categoryColor: 'bg-sage-100 text-sage-800 border-sage-200',
    iconEmoji: '🌸',
    targetDomains: ['ADHD', 'Working Memory', 'Visual Processing'],
    recommendedAge: 'All Ages',
    estimatedMinutes: 5,
    skills: ['Working Memory', 'Visual Recognition', 'Patience & Pacing'],
    component: MemoryGarden,
  },
  {
    id: 'emotion-explorer',
    slug: 'emotion-explorer',
    title: 'Emotion Explorer',
    tagline: 'Explore feelings and supportive coping responses',
    description: 'Understand everyday emotions through illustrated social scenarios. Learn positive coping strategies in a supportive, judgment-free space.',
    category: 'EMOTION',
    categoryLabel: 'Socio-Emotional Understanding',
    categoryColor: 'bg-peach-100 text-peach-800 border-peach-200',
    iconEmoji: '🎭',
    targetDomains: ['ASD', 'Social Communication', 'Emotional Regulation'],
    recommendedAge: '6+ to Adults',
    estimatedMinutes: 6,
    skills: ['Emotion Recognition', 'Perspective Taking', 'Coping Strategies'],
    component: EmotionExplorer,
  },
  {
    id: 'word-builder',
    slug: 'word-builder',
    title: 'Word Builder',
    tagline: 'Piece together phonetic letters with dyslexia-friendly visual cues',
    description: 'Build words letter by letter using high-contrast tiles and phonics hints. Crafted specifically to reduce letter-reversal stress.',
    category: 'LANGUAGE',
    categoryLabel: 'Language & Literacy',
    categoryColor: 'bg-lavender-100 text-lavender-800 border-lavender-200',
    iconEmoji: '📖',
    targetDomains: ['Dyslexia', 'Phonological Awareness', 'Reading Confidence'],
    recommendedAge: '5+ to Adults',
    estimatedMinutes: 5,
    skills: ['Phonics Association', 'Spelling Construction', 'Visual Letter Distinction'],
    component: WordBuilder,
  },
  {
    id: 'number-garden',
    slug: 'number-garden',
    title: 'Number Garden',
    tagline: 'Explore quantities and counting through interactive visual garden objects',
    description: 'Strengthen number sense with tangible visual groups instead of abstract arithmetic. Supports dyscalculia and visual learners.',
    category: 'NUMBERS',
    categoryLabel: 'Math & Number Sense',
    categoryColor: 'bg-dusty-100 text-dusty-800 border-dusty-200',
    iconEmoji: '🔢',
    targetDomains: ['Dyscalculia', 'Math Confidence', 'Visual Counting'],
    recommendedAge: 'All Ages',
    estimatedMinutes: 5,
    skills: ['Visual Counting', 'Subitizing', 'Quantity Comparison'],
    component: NumberGarden,
  },
  {
    id: 'focus-garden',
    slug: 'focus-garden',
    title: 'Focus Garden',
    tagline: 'Selective visual search in gentle nature scenes',
    description: 'Find serene hidden treasures among peaceful plants and friendly creatures without ticking clocks or stress.',
    category: 'FOCUS',
    categoryLabel: 'Focus & Selective Attention',
    categoryColor: 'bg-sage-100 text-sage-800 border-sage-200',
    iconEmoji: '🔍',
    targetDomains: ['ADHD', 'Sustained Attention', 'Visual Discrimination'],
    recommendedAge: 'All Ages',
    estimatedMinutes: 6,
    skills: ['Selective Attention', 'Visual Scanning', 'Detail Orientation'],
    component: FocusGarden,
  },
  {
    id: 'pattern-detective',
    slug: 'pattern-detective',
    title: 'Pattern Detective',
    tagline: 'Uncover sequence mysteries through colors, shapes, and rhythm',
    description: 'Solve logical pattern mysteries at your own rhythm. Explore the rule behind each sequence with friendly explanations.',
    category: 'NUMBERS',
    categoryLabel: 'Patterns & Logic',
    categoryColor: 'bg-lavender-100 text-lavender-800 border-lavender-200',
    iconEmoji: '🕵️',
    targetDomains: ['ADHD', 'ASD', 'Logical Deduction', 'Sequencing'],
    recommendedAge: '6+ to Adults',
    estimatedMinutes: 5,
    skills: ['Pattern Recognition', 'Logical Deduction', 'Sequential Thinking'],
    component: PatternDetective,
  },
  {
    id: 'story-builder',
    slug: 'story-builder',
    title: 'Story Builder',
    tagline: 'Craft heartwarming interactive narratives with text-to-speech audio',
    description: 'Choose your hero, world, challenge, and resolution to create heartwarming stories. Listen to your creation read aloud smoothly.',
    category: 'LANGUAGE',
    categoryLabel: 'Creative Communication',
    categoryColor: 'bg-cream-200 text-ink-800 border-cream-300',
    iconEmoji: '✨',
    targetDomains: ['ASD', 'Communication', 'Creative Agency', 'Reading Comprehension'],
    recommendedAge: 'All Ages',
    estimatedMinutes: 7,
    skills: ['Narrative Sequencing', 'Expressive Language', 'Creative Agency'],
    component: StoryBuilder,
  },
  {
    id: 'daily-life-simulator',
    slug: 'daily-life-simulator',
    title: 'Daily Life Simulator',
    tagline: 'Practice real-life packing, routines, and budgeting in a calm environment',
    description: 'Build confident executive function with practical everyday scenarios: packing travel essentials and managing a gentle grocery shopping list.',
    category: 'LIFE_SKILLS',
    categoryLabel: 'Executive Function & Life Skills',
    categoryColor: 'bg-dusty-100 text-dusty-800 border-dusty-200',
    iconEmoji: '🎒',
    targetDomains: ['ADHD', 'Executive Function', 'Independence', 'Planning'],
    recommendedAge: '8+ to Adults',
    estimatedMinutes: 8,
    skills: ['Prioritization', 'Task Organization', 'Budget Awareness'],
    component: DailyLifeSimulator,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAME_CATALOG.find((g) => g.id === id || g.slug === id);
}
