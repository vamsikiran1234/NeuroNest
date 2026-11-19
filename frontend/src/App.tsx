import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ComfortPage } from './pages/comfort/ComfortPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { GameHubPage } from './pages/games/GameHubPage';
import { GamePlayPage } from './pages/games/GamePlayPage';
import { LearningCornerPage } from './pages/learning/LearningCornerPage';
import { RoutinesPage } from './pages/routines/RoutinesPage';
import { ProgressPage } from './pages/progress/ProgressPage';
import { AIAssistantPage } from './pages/assistant/AIAssistantPage';
import { GuardianPortalPage } from './pages/guardian/GuardianPortalPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAccessibilityStore } from './stores/accessibilityStore';

// Temporary placeholders for navigation testing
function PlaceholderPage({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <div className="flex items-center gap-3">
        <span className="text-3xl p-3 rounded-2xl bg-cream-200">{icon}</span>
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const applyToDOM = useAccessibilityStore((s) => s.applyToDOM);

  useEffect(() => {
    applyToDOM();
  }, [applyToDOM]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding Wizard */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to /app */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Protected App Routes inside Shell */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="games" element={<GameHubPage />} />
          <Route path="games/:gameId" element={<GamePlayPage />} />
          <Route path="learning" element={<LearningCornerPage />} />
          <Route path="routines" element={<RoutinesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="assistant" element={<AIAssistantPage />} />
          <Route path="guardian" element={<GuardianPortalPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="comfort" element={<ComfortPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
