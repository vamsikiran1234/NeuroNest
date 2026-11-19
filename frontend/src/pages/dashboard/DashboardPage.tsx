import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { apiClient } from '../../api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Sparkles, 
  Gamepad2, 
  BookOpen, 
  CalendarCheck2, 
  Clock, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Sliders,
  Sun,
  Eye,
  Flower2
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  category: string;
  icon: string;
  duration: string;
}

interface RecommendedGame {
  id: string;
  title: string;
  skills: string;
  tagline: string;
  icon: string;
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAccessibilityStore((s) => s.presentationProfile);
  const quietMode = useAccessibilityStore((s) => s.quietModeEnabled);
  const setQuietMode = useAccessibilityStore((s) => s.setQuietMode);

  const [greeting, setGreeting] = useState('Welcome back');
  const [preferredName, setPreferredName] = useState(user?.displayName || 'Friend');
  const [isLoading, setIsLoading] = useState(true);

  // Default rich activities for dashboard
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'memory-garden', title: 'Memory Garden Exploration', category: 'Memory & Thinking', icon: 'Flower2', duration: '5 min' },
    { id: 'focus-garden', title: 'Focus Garden Observation', category: 'Focus & Attention', icon: 'Eye', duration: '6 min' },
    { id: 'morning-prep', title: 'Morning Calm Routine', category: 'Daily Journey', icon: 'Sun', duration: '4 min' },
  ]);

  const recommendedGames: RecommendedGame[] = [
    { id: 'memory-garden', title: 'Memory Garden', skills: 'Working Memory', tagline: 'Match tranquil blooming pairs at your own pace', icon: 'Flower2' },
    { id: 'emotion-explorer', title: 'Emotion Explorer', skills: 'Emotional Awareness', tagline: 'Explore social scenes and expressive feelings', icon: 'Heart' },
    { id: 'word-builder', title: 'Word Builder', skills: 'Reading & Language', tagline: 'Step by step spelling with gentle phonics', icon: 'BookOpen' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get<any>('/personalization/dashboard');
        if (res.data) {
          if (res.data.greeting) setGreeting(res.data.greeting);
          if (res.data.preferredName) setPreferredName(res.data.preferredName);
        }
      } catch {
        // Fallback to local time greeting
        const hr = new Date().getHours();
        if (hr < 12) setGreeting('Good morning');
        else if (hr < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cream-100 via-sage-100/50 to-lavender-100/40 p-6 sm:p-8 border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-primary text-xs font-bold shadow-sm">
              <span>🌱</span>
              <span className="capitalize">{profile.toLowerCase().replace('_', ' ')} Space</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-foreground">
              {greeting}, {preferredName}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
              Take all the time you need today. Explore learning games, review your daily routine, or settle into a quiet moment of focus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/games">
              <Button size="lg" className="gap-2 shadow-sm font-semibold">
                <Gamepad2 className="w-5 h-5" />
                Play &amp; Explore
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient decorative background illustration */}
        {!quietMode && (
          <div className="non-essential-visual absolute -right-6 -bottom-8 text-8xl opacity-20 pointer-events-none select-none">
            🌿
          </div>
        )}
      </div>

      {/* Presentation Profile Adaptive Banner for Young Explorers */}
      {profile === 'YOUNG_EXPLORERS' && (
        <div className="p-4 rounded-2xl bg-peach-100/70 border border-peach-200 flex items-center gap-4 animate-in fade-in-50">
          <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm">🦉</span>
          <div>
            <div className="font-bold text-base text-peach-900">Your Guide: Ollie the Owl</div>
            <div className="text-xs text-peach-700">
              "Ready to find some cards in the Memory Garden or build new words today?"
            </div>
          </div>
        </div>
      )}

      {/* Grid: Today's Gentle Activities & Recommended Games */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Journey Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-xl">Today's Journey</CardTitle>
                <CardDescription>
                  Activities curated to help you practice attention, learning, and daily flow.
                </CardDescription>
              </div>
              <Badge variant="sage">3 Ready</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-cream-100/70 border border-border/80 hover:bg-cream-100 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                      {act.icon === 'Flower2' ? <Flower2 className="w-5 h-5" /> : act.icon === 'Eye' ? <Eye className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{act.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{act.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {act.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/app/games/${act.id}/play`}>
                    <Button variant="soft" size="sm" className="gap-1 rounded-xl">
                      <Play className="w-3.5 h-3.5" /> Start
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/app/routines" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold gap-1.5">
                  <CalendarCheck2 className="w-3.5 h-3.5" /> Manage Daily Checklist &amp; Routines
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Recommended Playful Games */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">
                  Recommended For You
                </h2>
                <p className="text-xs text-muted-foreground">
                  Based on your selected interests without pressure or diagnostic stereotyping.
                </p>
              </div>
              <Link to="/app/games" className="text-xs font-bold text-primary hover:underline">
                View all 8 games →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedGames.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow border-border flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-2xl bg-sage-100 text-primary flex items-center justify-center mb-2">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base">{game.title}</CardTitle>
                    <Badge variant="sage" className="w-fit text-[10px] mt-1">
                      {game.skills}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                    {game.tagline}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/app/games/${game.id}/play`} className="w-full">
                      <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs font-bold">
                        <Play className="w-3.5 h-3.5" /> Play Game
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Daily Journey, Goals, and Encouragement */}
        <div className="space-y-6">
          {/* Daily Routine Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-primary" /> Daily Checklist
                </CardTitle>
                <span className="text-xs font-bold text-primary">2 of 4 done</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { title: 'Morning teeth & wash', done: true },
                { title: 'Healthy breakfast & water', done: true },
                { title: '15 min peaceful reading', done: false },
                { title: 'Pack tomorrow backpack', done: false },
              ].map((task, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-colors ${
                    task.done
                      ? 'bg-sage-50/80 border-sage-200 text-muted-foreground line-through'
                      : 'bg-card border-border text-foreground font-medium'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${task.done ? 'text-primary' : 'text-muted-foreground/40'}`}
                  />
                  <span>{task.title}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/app/routines" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                  Open Daily Journey →
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Personal Goals Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-lavender-500" /> Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Practice Attention Activities</span>
                  <span className="text-primary font-bold">2 / 3</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Explore Reading Exercises</span>
                  <span className="text-dustyBlue-500 font-bold">1 / 2</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                  <div className="h-full bg-dustyBlue-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encouraging Reflection Box */}
          <div className="p-5 rounded-3xl bg-lavender-100/50 border border-lavender-200 space-y-2 text-ink-900">
            <div className="flex items-center gap-2 font-bold text-sm text-lavender-700">
              <Sparkles className="w-4 h-4" /> Gentle Reflection
            </div>
            <p className="text-xs leading-relaxed text-ink-700 font-reading">
              "You explored three activities this week. Remember that learning has no fixed speed; your comfort and curiosity guide the way."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
