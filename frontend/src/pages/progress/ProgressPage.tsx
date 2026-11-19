import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  Heart,
  Gamepad2,
  Calendar,
  CheckCircle2,
  Smile,
} from 'lucide-react';

const WEEKLY_ENGAGEMENT = [
  { day: 'Mon', minutes: 20 },
  { day: 'Tue', minutes: 35 },
  { day: 'Wed', minutes: 15 },
  { day: 'Thu', minutes: 25 },
  { day: 'Fri', minutes: 30 },
  { day: 'Sat', minutes: 40 },
  { day: 'Sun', minutes: 25 },
];

const SKILLS_NURTURED = [
  { skill: 'Memory', value: 85 },
  { skill: 'Attention', value: 75 },
  { skill: 'Language', value: 90 },
  { skill: 'Logic', value: 80 },
  { skill: 'Empathy', value: 95 },
  { skill: 'Life Skills', value: 70 },
];

const MILESTONES = [
  {
    id: 'm1',
    title: 'First Step Explorer',
    description: 'Began exploring your personal space and tried your first activity.',
    iconEmoji: '🌱',
    earned: true,
  },
  {
    id: 'm2',
    title: 'Story Weaver',
    description: 'Crafted an original heartwarming story in the Story Builder.',
    iconEmoji: '✨',
    earned: true,
  },
  {
    id: 'm3',
    title: 'Gentle Focus Master',
    description: 'Discovered hidden treasures with patience in the Focus Garden.',
    iconEmoji: '🔍',
    earned: true,
  },
  {
    id: 'm4',
    title: 'Routine Companion',
    description: 'Completed a morning or evening routine flow at your own pace.',
    iconEmoji: '☀️',
    earned: true,
  },
  {
    id: 'm5',
    title: 'Comfort Champion',
    description: 'Customized your reading fonts, contrast, and color tints.',
    iconEmoji: '🎨',
    earned: true,
  },
  {
    id: 'm6',
    title: 'Curious Reader',
    description: 'Explored 3 deep science or nature stories in the Learning Corner.',
    iconEmoji: '📚',
    earned: false,
  },
];

export function ProgressPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-peach-50 to-sage-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-peach-200 text-xs font-bold text-peach-800">
            <TrendingUp className="w-3.5 h-3.5" />
            Positive, Non-Competitive Insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            My Growth & Exploration
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            Every step you take is worth celebrating. Here is a calm reflection of your time spent learning, exploring games, and nurturing daily routines.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 rounded-3xl border-border bg-white text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-foreground">7</p>
          <p className="text-xs text-muted-foreground font-reading">Days Nurtured</p>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-dusty-100 text-dusty-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-foreground">190 min</p>
          <p className="text-xs text-muted-foreground font-reading">Mindful Focus</p>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-peach-100 text-peach-700 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-foreground">8 / 8</p>
          <p className="text-xs text-muted-foreground font-reading">Games Explored</p>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-lavender-100 text-lavender-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-foreground">24</p>
          <p className="text-xs text-muted-foreground font-reading">Routines Completed</p>
        </Card>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Engagement */}
        <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Weekly Exploration Time</h3>
              <p className="text-xs text-muted-foreground font-reading">Minutes spent exploring activities this week</p>
            </div>
            <span className="text-xs font-bold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
              Balanced Flow
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ENGAGEMENT}>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}m`} />
                <Tooltip
                  formatter={(val: number) => [`${val} minutes`, 'Focus Time']}
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" fill="#B8CDBB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Skills Distribution */}
        <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Areas of Exploration</h3>
              <p className="text-xs text-muted-foreground font-reading">Balanced practice across cognitive and practical domains</p>
            </div>
            <span className="text-xs font-bold text-dusty-700 bg-dusty-50 px-2.5 py-1 rounded-full border border-dusty-200">
              Multi-Dimensional
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SKILLS_NURTURED}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#303B3A', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="value" stroke="#AFC7D8" fill="#AFC7D8" fillOpacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #E2E8F0', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Milestone Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-peach-600" />
          <h3 className="text-lg font-bold text-foreground">Celebrated Milestones</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MILESTONES.map((badge) => (
            <Card
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-3.5 ${
                badge.earned
                  ? 'bg-white border-border shadow-xs'
                  : 'bg-cream-50/50 border-border/60 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  badge.earned ? 'bg-cream-100 border border-border shadow-2xs' : 'bg-gray-100'
                }`}
              >
                {badge.iconEmoji}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{badge.title}</h4>
                  {badge.earned && (
                    <span className="text-[10px] font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                      Earned
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-reading mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
