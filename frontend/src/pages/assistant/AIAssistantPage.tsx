import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../api/client';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  ListTodo,
  Compass,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SimplifyResult {
  simplifiedText: string;
  keyPoints: string[];
  vocabulary: { term: string; definition: string }[];
  fallbackUsed: boolean;
}

interface TaskResult {
  taskTitle: string;
  encouragingAdvice: string;
  steps: { stepNumber: number; title: string; detail: string; estimatedMinutes: number }[];
  fallbackUsed: boolean;
}

interface GameRecResult {
  friendlyMessage: string;
  recommendations: { gameId: string; title: string; reason: string; category: string }[];
  fallbackUsed: boolean;
}

interface AskResult {
  answer: string;
  encouragingTakeaway: string;
  fallbackUsed: boolean;
}

export function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<'SIMPLIFY' | 'BREAKDOWN' | 'RECOMMEND' | 'ASK'>('SIMPLIFY');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Tool 1: Simplify
  const [simplifyInput, setSimplifyInput] = useState('');
  const [simplifyResult, setSimplifyResult] = useState<SimplifyResult | null>(null);

  // Tool 2: Task Breakdown
  const [taskInput, setTaskInput] = useState('');
  const [taskResult, setTaskResult] = useState<TaskResult | null>(null);

  // Tool 3: Recommendations
  const [selectedMood, setSelectedMood] = useState('NEED_CALM');
  const [gameResult, setGameResult] = useState<GameRecResult | null>(null);

  // Tool 4: Ask
  const [askInput, setAskInput] = useState('');
  const [askResult, setAskResult] = useState<AskResult | null>(null);

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleSimplifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simplifyInput.trim()) return;

    setLoading(true);
    try {
      const res = await apiClient.post<{ data: SimplifyResult }>('/api/v1/ai/simplify', {
        text: simplifyInput,
        level: 'ACCESSIBLE',
      });
      setSimplifyResult(res.data.data);
    } catch {
      // Local defensive fallback
      setSimplifyResult({
        simplifiedText: `Here is the simplified version of your text:\n\n• ${simplifyInput.slice(0, 140)}...`,
        keyPoints: ['Core thoughts summarized cleanly', 'Short, digestible sentences'],
        vocabulary: [{ term: 'Overview', definition: 'The key takeaway message.' }],
        fallbackUsed: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setLoading(true);
    try {
      const res = await apiClient.post<{ data: TaskResult }>('/api/v1/ai/breakdown-task', {
        taskTitle: taskInput,
      });
      setTaskResult(res.data.data);
    } catch {
      setTaskResult({
        taskTitle: taskInput,
        encouragingAdvice: 'Remember, you only need to focus on Step 1 right now.',
        steps: [
          { stepNumber: 1, title: 'Gather items or clear your workspace', detail: 'Prepare what you need without hurry.', estimatedMinutes: 3 },
          { stepNumber: 2, title: 'Complete the very first step', detail: 'Spend just 5 minutes on the first action.', estimatedMinutes: 5 },
          { stepNumber: 3, title: 'Pause and take three calm breaths', detail: 'Check in with how your energy feels.', estimatedMinutes: 2 },
          { stepNumber: 4, title: 'Finish and put tools away', detail: 'Celebrate completing a focused block of time.', estimatedMinutes: 5 },
        ],
        fallbackUsed: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendSubmit = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const res = await apiClient.post<{ data: GameRecResult }>('/api/v1/ai/recommend-games', {
        currentMood: mood,
      });
      setGameResult(res.data.data);
    } catch {
      setGameResult({
        friendlyMessage: 'Here are two gentle, pressure-free activities for you:',
        recommendations: [
          { gameId: 'memory-garden', title: 'Memory Garden', reason: 'Untimed card matching with calming sounds.', category: 'Memory' },
          { gameId: 'story-builder', title: 'Story Builder', reason: 'Creative storytelling with text-to-speech audio.', category: 'Communication' },
        ],
        fallbackUsed: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;

    setLoading(true);
    try {
      const res = await apiClient.post<{ data: AskResult }>('/api/v1/ai/ask', {
        prompt: askInput,
      });
      setAskResult(res.data.data);
    } catch {
      setAskResult({
        answer: 'Learning is most comfortable when taken in gentle steps! You can always customize fonts in My Comfort or take untimed pauses.',
        encouragingTakeaway: 'Every mind explores in its own unique rhythm.',
        fallbackUsed: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-sage-50 to-lavender-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-sage-200 text-xs font-bold text-sage-800">
            <Sparkles className="w-3.5 h-3.5 text-sage-600" />
            AI Learning Guide
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Gentle AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            An optional, patient companion to simplify complex text, break down overwhelming chores, and suggest peaceful activities.
          </p>
        </div>
      </div>

      {/* Safety & Consent Transparent Notice */}
      <div className="p-4 rounded-2xl bg-cream-50 border border-border/80 flex items-start gap-3 text-xs font-reading text-muted-foreground">
        <ShieldCheck className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-foreground block">Safety & Boundaries Notice</span>
          NeuroNest AI is an educational and organizational helper, not a medical or diagnostic tool. It will never claim to assess, diagnose, or treat any condition, and all essential platform features remain 100% available offline without AI.
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        <button
          onClick={() => setActiveTab('SIMPLIFY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'SIMPLIFY'
              ? 'bg-sage-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Simplify Text
        </button>

        <button
          onClick={() => setActiveTab('BREAKDOWN')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'BREAKDOWN'
              ? 'bg-dusty-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Break Down a Task
        </button>

        <button
          onClick={() => {
            setActiveTab('RECOMMEND');
            if (!gameResult) handleRecommendSubmit('NEED_CALM');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'RECOMMEND'
              ? 'bg-lavender-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Find My Ideal Activity
        </button>

        <button
          onClick={() => setActiveTab('ASK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ASK'
              ? 'bg-peach-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Ask a Question
        </button>
      </div>

      {/* TAB 1: SIMPLIFY */}
      {activeTab === 'SIMPLIFY' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
            <h3 className="font-bold text-base text-foreground">Paste or Type Text to Simplify</h3>
            <p className="text-xs text-muted-foreground font-reading">
              Have a dense article, school syllabus, or paragraph? The AI will restructure it into calm sentences and bullet points.
            </p>

            <form onSubmit={handleSimplifySubmit} className="space-y-3">
              <textarea
                value={simplifyInput}
                onChange={(e) => setSimplifyInput(e.target.value)}
                placeholder="Paste text here or click a sample below..."
                rows={6}
                className="w-full p-3.5 rounded-2xl border border-border bg-cream-50 text-sm font-reading focus:outline-hidden focus:ring-2 focus:ring-sage-400"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Samples:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSimplifyInput(
                        'Photosynthesis is an intracellular metabolic pathway that transforms radiant energy from sun photons into chemical bonds inside carbohydrate polymers while emitting diatomic oxygen.'
                      )
                    }
                    className="underline hover:text-foreground text-xs"
                  >
                    Photosynthesis
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSimplifyInput(
                        'A total solar eclipse occurs when the Moon passes directly between Earth and the Sun, completely blocking the face of the Sun and casting an umbra shadow across terrestrial observers.'
                      )
                    }
                    className="underline hover:text-foreground text-xs"
                  >
                    Solar Eclipse
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !simplifyInput.trim()}
                  size="sm"
                  className="bg-sage-600 hover:bg-sage-700 text-white text-xs"
                >
                  {loading ? 'Simplifying...' : 'Simplify Text ✨'}
                </Button>
              </div>
            </form>
          </Card>

          {simplifyResult && (
            <Card className="p-6 rounded-3xl border-border bg-white space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sage-800">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  Simplified Breakdown
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSpeak(simplifyResult.simplifiedText)}
                  className="text-xs flex items-center gap-1.5"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-peach-600" /> Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-sage-600" /> Read to Me
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-sage-50/60 border border-sage-200 text-sm font-reading whitespace-pre-line leading-relaxed text-foreground">
                {simplifyResult.simplifiedText}
              </div>

              {simplifyResult.vocabulary && simplifyResult.vocabulary.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-cream-100 border border-border space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Helpful Terms
                  </h4>
                  <div className="space-y-1.5">
                    {simplifyResult.vocabulary.map((v) => (
                      <div key={v.term} className="text-xs">
                        <span className="font-bold text-foreground">{v.term}: </span>
                        <span className="text-muted-foreground">{v.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: TASK BREAKDOWN */}
      {activeTab === 'BREAKDOWN' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
            <h3 className="font-bold text-base text-foreground">Turn Big Tasks into Micro-Steps</h3>
            <p className="text-xs text-muted-foreground font-reading">
              When executive function feels taxed, a big task like "Clean Room" can feel paralyzing. Break it into 3-4 bite-sized actions.
            </p>

            <form onSubmit={handleTaskSubmit} className="space-y-3">
              <Input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="e.g., Clean my bedroom, write a history essay, prepare for doctor visit..."
                className="bg-cream-50"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => setTaskInput('Clean my messy room')}
                    className="underline hover:text-foreground text-xs"
                  >
                    Clean room
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setTaskInput('Write 2-page science paper')}
                    className="underline hover:text-foreground text-xs"
                  >
                    Science paper
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !taskInput.trim()}
                  size="sm"
                  className="bg-dusty-600 hover:bg-dusty-700 text-white text-xs"
                >
                  {loading ? 'Breaking Down...' : 'Break It Down 🧩'}
                </Button>
              </div>
            </form>
          </Card>

          {taskResult && (
            <Card className="p-6 rounded-3xl border-border bg-white space-y-4 animate-in fade-in">
              <div>
                <h4 className="font-bold text-sm text-foreground">{taskResult.taskTitle}</h4>
                <p className="text-xs text-muted-foreground font-reading mt-1">{taskResult.encouragingAdvice}</p>
              </div>

              <div className="space-y-2.5">
                {taskResult.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-2xl bg-dusty-50/60 border border-dusty-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-dusty-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{step.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-white px-2 py-0.5 rounded-md border border-border">
                          ~{step.estimatedMinutes}m
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-reading mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: RECOMMENDATIONS */}
      {activeTab === 'RECOMMEND' && (
        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
            <h3 className="font-bold text-base text-foreground">How Are You Feeling Right Now?</h3>
            <p className="text-xs text-muted-foreground font-reading">
              Select your current mood or sensory preference to get gentle, tailored activity suggestions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'NEED_CALM', label: 'Need Calm & Peaceful Pacing', icon: '🌸' },
                { id: 'NEED_FOCUS', label: 'Want to Practice Gentle Focus', icon: '🔍' },
                { id: 'FEELING_CREATIVE', label: 'Feeling Creative & Expressive', icon: '🎨' },
                { id: 'LIFE_PRACTICE', label: 'Everyday Practical Skills', icon: '🎒' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleRecommendSubmit(m.id)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all select-none ${
                    selectedMood === m.id
                      ? 'bg-lavender-50 border-lavender-400 font-bold shadow-xs'
                      : 'bg-white hover:bg-cream-50 border-border'
                  }`}
                >
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-xs text-foreground mt-1">{m.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {gameResult && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-sm font-bold text-foreground font-reading">{gameResult.friendlyMessage}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameResult.recommendations.map((rec) => (
                  <Card key={rec.gameId} className="p-5 rounded-3xl border-border bg-white flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-100 text-muted-foreground">
                        {rec.category}
                      </span>
                      <h4 className="font-bold text-base text-foreground">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground font-reading">{rec.reason}</p>
                    </div>

                    <Link to={`/app/games/${rec.gameId}`}>
                      <Button size="sm" className="bg-lavender-600 hover:bg-lavender-700 text-white text-xs rounded-xl flex items-center gap-1 whitespace-nowrap">
                        Play Activity <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ASK QUESTION */}
      {activeTab === 'ASK' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="p-6 rounded-3xl border-border bg-white space-y-4">
            <h3 className="font-bold text-base text-foreground">Ask Any Question</h3>
            <p className="text-xs text-muted-foreground font-reading">
              Ask about study techniques, sensory strategies, or how to navigate the platform.
            </p>

            <form onSubmit={handleAskSubmit} className="space-y-3">
              <Input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="e.g., How can I keep my focus when reading long stories?"
                className="bg-cream-50"
              />

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={loading || !askInput.trim()}
                  size="sm"
                  className="bg-peach-600 hover:bg-peach-700 text-white text-xs"
                >
                  {loading ? 'Thinking gently...' : 'Ask Assistant 💬'}
                </Button>
              </div>
            </form>
          </Card>

          {askResult && (
            <Card className="p-6 rounded-3xl border-border bg-white space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold text-peach-800">Supportive Answer</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSpeak(askResult.answer)}
                  className="text-xs flex items-center gap-1.5"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-peach-600" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-peach-600" /> Read to Me
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-foreground font-reading leading-relaxed whitespace-pre-line">
                {askResult.answer}
              </p>

              <div className="p-3.5 rounded-2xl bg-peach-50/60 border border-peach-200 text-xs font-reading text-peach-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-peach-600 flex-shrink-0" />
                <span>{askResult.encouragingTakeaway}</span>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
