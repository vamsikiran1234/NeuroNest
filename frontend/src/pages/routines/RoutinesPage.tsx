import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { soundManager } from '../../features/games/engine/soundUtils';
import {
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
  Sparkles,
  Calendar,
  CheckSquare,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RoutineStep {
  id: string;
  title: string;
  detail: string;
  estimatedMinutes: number;
  completed: boolean;
}

interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'CUSTOM';
  icon: string;
  color: string;
  steps: RoutineStep[];
}

interface UserTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  completed: boolean;
}

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'r1',
    title: 'Calm Morning Flow',
    description: 'Gentle steps to greet the day peacefully without rush',
    category: 'MORNING',
    icon: 'Sun',
    color: 'border-sage-300 bg-sage-50/40',
    steps: [
      { id: 's1', title: 'Drink a warm glass of water', detail: 'Hydrate and take three calm breaths', estimatedMinutes: 2, completed: true },
      { id: 's2', title: 'Open blinds for natural sunlight', detail: 'Notice the morning light and clouds', estimatedMinutes: 3, completed: false },
      { id: 's3', title: 'Nutritious breakfast', detail: 'Enjoy breakfast without screen pressure', estimatedMinutes: 15, completed: false },
      { id: 's4', title: 'Review today\'s gentle checklist', detail: 'Pick 1 or 2 small goals for the day', estimatedMinutes: 5, completed: false },
    ],
  },
  {
    id: 'r2',
    title: 'Sensory Evening Unwind',
    description: 'Quiet down auditory and visual stimulations before rest',
    category: 'EVENING',
    icon: 'Moon',
    color: 'border-lavender-300 bg-lavender-50/40',
    steps: [
      { id: 's5', title: 'Dim bright overhead lights', detail: 'Switch to warm side lamps', estimatedMinutes: 2, completed: false },
      { id: 's6', title: 'Pack tomorrow\'s bag', detail: 'Place water bottle and notebook by the door', estimatedMinutes: 5, completed: false },
      { id: 's7', title: 'Quiet reading or calming music', detail: 'Let eyes and mind settle softly', estimatedMinutes: 15, completed: false },
    ],
  },
];

const INITIAL_TASKS: UserTask[] = [
  { id: 't1', title: 'Explore 1 Learning Corner Story', description: 'Read about honeybees or Jupiter at your own pace', category: 'Study', priority: 'LOW', completed: false },
  { id: 't2', title: 'Play 1 round of Memory Garden', description: 'Match calming flower and nature cards', category: 'Play', priority: 'LOW', completed: true },
  { id: 't3', title: '5-minute deep breath or stretch', description: 'Gently stretch arms and shoulders', category: 'Comfort', priority: 'LOW', completed: false },
];

export function RoutinesPage() {
  const [activeTab, setActiveTab] = useState<'ROUTINES' | 'TASKS'>('ROUTINES');
  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const saved = localStorage.getItem('neuronest_local_routines');
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  });

  const [tasks, setTasks] = useState<UserTask[]>(() => {
    try {
      const saved = localStorage.getItem('neuronest_local_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Daily');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const saveRoutines = (updated: Routine[]) => {
    setRoutines(updated);
    try {
      localStorage.setItem('neuronest_local_routines', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const saveTasks = (updated: UserTask[]) => {
    setTasks(updated);
    try {
      localStorage.setItem('neuronest_local_tasks', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const toggleRoutineStep = (routineId: string, stepId: string) => {
    const updated = routines.map((r) => {
      if (r.id !== routineId) return r;
      return {
        ...r,
        steps: r.steps.map((s) => {
          if (s.id !== stepId) return s;
          const nextCompleted = !s.completed;
          if (nextCompleted) soundManager.playMatch();
          return { ...s, completed: nextCompleted };
        }),
      };
    });
    saveRoutines(updated);
  };

  const resetRoutine = (routineId: string) => {
    const updated = routines.map((r) => {
      if (r.id !== routineId) return r;
      return {
        ...r,
        steps: r.steps.map((s) => ({ ...s, completed: false })),
      };
    });
    saveRoutines(updated);
    soundManager.playFlip();
  };

  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const nextCompleted = !t.completed;
      if (nextCompleted) soundManager.playCelebration();
      return { ...t, completed: nextCompleted };
    });
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: UserTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Custom daily focus step',
      category: newTaskCategory,
      priority: 'LOW',
      completed: false,
    };

    saveTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsAddingTask(false);
    soundManager.playMatch();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cream-100 via-dusty-50 to-sage-50 p-6 sm:p-8 border border-border">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-dusty-200 text-xs font-bold text-dusty-800">
            <Calendar className="w-3.5 h-3.5" />
            Executive Function & Daily Flow
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Daily Journey
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-reading leading-relaxed">
            Supportive routines and gentle checklists that turn daily overwhelm into clear, comfortable steps. Reset anytime with zero guilt.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('ROUTINES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ROUTINES'
              ? 'bg-sage-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <Sun className="w-4 h-4" />
          Daily Routines ({routines.length})
        </button>

        <button
          onClick={() => setActiveTab('TASKS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'TASKS'
              ? 'bg-dusty-600 text-white shadow-xs'
              : 'bg-cream-100 text-foreground hover:bg-cream-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Today's Checklist ({tasks.filter((t) => t.completed).length}/{tasks.length})
        </button>
      </div>

      {/* TAB 1: ROUTINES */}
      {activeTab === 'ROUTINES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routines.map((routine) => {
              const completedCount = routine.steps.filter((s) => s.completed).length;
              const totalCount = routine.steps.length;
              const isAllDone = completedCount === totalCount && totalCount > 0;

              return (
                <Card
                  key={routine.id}
                  className={`rounded-3xl border ${routine.color} p-6 space-y-5 bg-white shadow-xs`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-border flex items-center justify-center text-foreground">
                        {routine.category === 'MORNING' ? (
                          <Sun className="w-6 h-6 text-peach-600" />
                        ) : (
                          <Moon className="w-6 h-6 text-lavender-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{routine.title}</h3>
                        <p className="text-xs text-muted-foreground font-reading">{routine.description}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetRoutine(routine.id)}
                      className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground flex items-center gap-1"
                      title="Reset steps for a fresh start"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span>Flow Progress</span>
                      <span className={isAllDone ? 'text-sage-700 font-extrabold' : ''}>
                        {completedCount} / {totalCount} Completed
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className="h-full bg-sage-500 rounded-full transition-all duration-300"
                        style={{ width: `${(completedCount / Math.max(1, totalCount)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-2 pt-1">
                    {routine.steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => toggleRoutineStep(routine.id, step.id)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 select-none ${
                          step.completed
                            ? 'bg-sage-50/70 border-sage-200 text-foreground opacity-80'
                            : 'bg-white hover:bg-cream-50 border-border'
                        }`}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-sage-600 fill-sage-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/60" />
                          )}
                        </span>
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-reading mt-0.5">{step.detail}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono bg-cream-100 px-2 py-0.5 rounded-md">
                          ~{step.estimatedMinutes}m
                        </span>
                      </button>
                    ))}
                  </div>

                  {isAllDone && (
                    <div className="p-3 rounded-2xl bg-sage-100 border border-sage-300 text-sage-900 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in-95">
                      <Sparkles className="w-4 h-4 text-sage-700" />
                      Wonderful job completing this routine!
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeTab === 'TASKS' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Add Task Quick Trigger */}
          {!isAddingTask ? (
            <Button
              onClick={() => setIsAddingTask(true)}
              className="w-full bg-white hover:bg-cream-50 text-foreground border border-dashed border-border py-4 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs"
            >
              <Plus className="w-4 h-4 text-sage-600" />
              Add a Gentle Focus Task
            </Button>
          ) : (
            <Card className="p-6 rounded-3xl border-border bg-white space-y-4 animate-in zoom-in-95">
              <h4 className="font-bold text-sm text-foreground">Add New Focus Item</h4>
              <form onSubmit={handleAddTask} className="space-y-3">
                <Input
                  type="text"
                  placeholder="e.g., Read 5 pages, organize my desk, take mindful walk..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
                <div className="flex items-center justify-between gap-3">
                  <select
                    aria-label="Task Category"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-border bg-cream-50 text-xs font-medium"
                  >
                    <option value="Daily">Daily Flow</option>
                    <option value="Study">Learning & Reading</option>
                    <option value="Comfort">Self Care & Comfort</option>
                    <option value="Personal">Personal Projects</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingTask(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-sage-600 hover:bg-sage-700 text-white text-xs">
                      Save Task
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          )}

          {/* Task Items */}
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 select-none shadow-xs ${
                  task.completed
                    ? 'bg-dusty-50/60 border-dusty-200 text-muted-foreground'
                    : 'bg-white hover:bg-cream-50 border-border'
                }`}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-dusty-600 fill-dusty-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/60" />
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${task.completed ? 'line-through' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cream-100 text-muted-foreground">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-reading mt-0.5">{task.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
