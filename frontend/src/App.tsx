import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ComfortPage } from './pages/comfort/ComfortPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
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
          <Route index element={<PlaceholderPage title="My Space" icon="🌱" description="Your calm, personalized home dashboard." />} />
          <Route path="games" element={<PlaceholderPage title="Play & Explore" icon="🎮" description="Discover 8 calm educational games for skills and focus." />} />
          <Route path="learning" element={<PlaceholderPage title="Learning Corner" icon="📖" description="Accessible reading, section-by-section breakdown, and simplification." />} />
          <Route path="routines" element={<PlaceholderPage title="Daily Journey" icon="📅" description="Organize routines, checklist tasks, and visual timelines without stress." />} />
          <Route path="progress" element={<PlaceholderPage title="My Growth" icon="📈" description="Celebrate your learning journey and personal exploration." />} />
          <Route path="assistant" element={<PlaceholderPage title="AI Learning Guide" icon="✨" description="Optional gentle assistant to clarify questions and break down tasks." />} />
          <Route path="comfort" element={<ComfortPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
