import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import {
  Users,
  ShieldCheck,
  Heart,
  Lock,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Gamepad2,
  Calendar,
} from 'lucide-react';

interface DependentInfo {
  id: string;
  name: string;
  email: string;
  presentationProfile: string;
  gamesCompleted: number;
  routinesCompleted: number;
  favoriteTopics: string[];
}

interface ConsentSetting {
  id: string;
  title: string;
  description: string;
  granted: boolean;
}

export function GuardianPortalPage() {
  const [dependents, setDependents] = useState<DependentInfo[]>([
    {
      id: 'dep-1',
      name: 'Leo',
      email: 'leo@neuronest.dev',
      presentationProfile: 'Young Explorers',
      gamesCompleted: 6,
      routinesCompleted: 14,
      favoriteTopics: ['Science & Nature', 'Space & Planets', 'Story Builder'],
    },
  ]);

  const [consents, setConsents] = useState<ConsentSetting[]>([
    {
      id: 'MINOR_ACCOUNT_CREATION',
      title: 'Minor Account Authorization',
      description: 'Parental confirmation granting minor access to the accessible NeuroNest learning environment.',
      granted: true,
    },
    {
      id: 'DATA_STORAGE',
      title: 'Comfort & Progress Persistence',
      description: 'Securely saves customized theme preferences, font choices, and milestone completions.',
      granted: true,
    },
    {
      id: 'AI_ASSISTANCE',
      title: 'Optional AI Learning Guide',
      description: 'Permits access to the gentle text simplifier and task breakdown assistant. Can be disabled anytime.',
      granted: true,
    },
  ]);

  const [linkEmail, setLinkEmail] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkFeedback, setLinkFeedback] = useState<string | null>(null);

  const toggleConsent = (consentId: string) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === consentId ? { ...c, granted: !c.granted } : c))
    );
  };

  const handleLinkDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkEmail.trim()) return;

    setIsLinking(true);
    setTimeout(() => {
      setDependents((prev) => [
        ...prev,
        {
          id: `dep-${Date.now()}`,
          name: linkEmail.split('@')[0],
          email: linkEmail.trim(),
          presentationProfile: 'Independent Learners',
          gamesCompleted: 0,
          routinesCompleted: 0,
          favoriteTopics: ['Calm Games', 'Routines'],
        },
      ]);
      setLinkFeedback(`Successfully established guardian link with ${linkEmail.trim()}`);
      setLinkEmail('');
      setIsLinking(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-sage-50 to-peach-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sage-200 text-xs font-bold text-sage-800">
            <Users className="w-3.5 h-3.5 text-sage-600" />
            Family & Educator Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Guardian Portal
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            Manage dependent account connections, consent settings, and view positive learning milestones in a privacy-respecting environment.
          </p>
        </div>
      </div>

      {/* Child Privacy Safeguard Guarantee */}
      <div className="p-5 rounded-3xl bg-white border border-border shadow-xs flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-dusty-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 font-reading text-xs">
          <h4 className="font-bold text-sm text-foreground">Strict Child Privacy & Dignity Guarantee</h4>
          <p className="text-muted-foreground leading-relaxed">
            NeuroNest prioritizes child safety and personal autonomy. Guardians can view overarching positive milestones and customize safety consents. 
            <strong> Raw journal reflections, creative story writings, and individual trial attempts are never surveilled or exposed.</strong>
          </p>
        </div>
      </div>

      {/* Dependents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Connected Dependent Accounts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dependents.map((dep) => (
            <Card key={dep.id} className="p-6 rounded-3xl border-border bg-white space-y-5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-foreground">{dep.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-50 text-sage-800 border border-sage-200">
                      Linked
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{dep.email}</p>
                </div>
                <span className="text-xs font-bold text-dusty-700 bg-cream-100 px-3 py-1 rounded-xl">
                  {dep.presentationProfile}
                </span>
              </div>

              {/* Learning Snapshot */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-border text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Gamepad2 className="w-3.5 h-3.5 text-peach-600" />
                    <span>Games Explored</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{dep.gamesCompleted}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-cream-50 border border-border text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5 text-sage-600" />
                    <span>Routines Completed</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{dep.routinesCompleted}</p>
                </div>
              </div>

              {/* Topics of Interest */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">Favorite Learning Topics</span>
                <div className="flex flex-wrap gap-1.5">
                  {dep.favoriteTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-cream-100 text-foreground border border-border"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Consent Controls */}
      <Card className="p-6 sm:p-8 rounded-3xl border-border bg-white space-y-6 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-foreground">Consent & Safety Controls</h3>
          <p className="text-xs text-muted-foreground font-reading mt-0.5">
            Manage security and data consent permissions for minor learners. Toggles take effect immediately.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-border/60">
          {consents.map((consent) => (
            <div key={consent.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h4 className="text-sm font-bold text-foreground">{consent.title}</h4>
                <p className="text-xs text-muted-foreground font-reading leading-relaxed">
                  {consent.description}
                </p>
              </div>

              <div className="pt-1">
                <Switch
                  checked={consent.granted}
                  onCheckedChange={() => toggleConsent(consent.id)}
                  aria-label={`Toggle ${consent.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Link New Dependent Account Form */}
      <Card className="p-6 rounded-3xl border-border bg-cream-50 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4 text-sage-600" /> Link Additional Dependent Account
        </h3>
        <p className="text-xs text-muted-foreground font-reading">
          Enter the registered email of your child or student to send a connection invitation.
        </p>

        <form onSubmit={handleLinkDependent} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="child@example.com"
            value={linkEmail}
            onChange={(e) => setLinkEmail(e.target.value)}
            className="bg-white flex-1"
          />
          <Button
            type="submit"
            disabled={isLinking || !linkEmail.trim()}
            className="bg-sage-600 hover:bg-sage-700 text-white text-xs whitespace-nowrap"
          >
            {isLinking ? 'Linking...' : 'Send Link Request'}
          </Button>
        </form>

        {linkFeedback && (
          <p className="text-xs font-bold text-sage-800 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-sage-600" />
            {linkFeedback}
          </p>
        )}
      </Card>
    </div>
  );
}
