import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { ComfortPanel } from '../accessibility/ComfortPanel';
import { ReadingRuler } from '../ui/ReadingRuler';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { Button } from '../ui/Button';
import {
  Sliders,
  Moon,
  Sun,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  LayoutDashboard,
  Gamepad2,
  BookOpen,
  CalendarCheck2,
} from 'lucide-react';

export function AppShell() {
  const [comfortOpen, setComfortOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const quietMode = useAccessibilityStore((s) => s.quietModeEnabled);
  const setQuietMode = useAccessibilityStore((s) => s.setQuietMode);
  const soundEnabled = useAccessibilityStore((s) => s.soundEffectsEnabled);
  const setSoundEffects = useAccessibilityStore((s) => s.setSoundEffects);

  // Bottom navigation items for mobile
  const mobileNav = [
    { name: 'Space', href: '/app', icon: LayoutDashboard },
    { name: 'Games', href: '/app/games', icon: Gamepad2 },
    { name: 'Learn', href: '/app/learning', icon: BookOpen },
    { name: 'Routines', href: '/app/routines', icon: CalendarCheck2 },
    { name: 'Comfort', onClick: () => setComfortOpen(true), icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Visual Reading Guide Overlay */}
      <ReadingRuler />

      {/* Accessibility Comfort Panel Modal */}
      <ComfortPanel open={comfortOpen} onOpenChange={setComfortOpen} />

      {/* Top Header Bar */}
      <header className="h-16 flex-shrink-0 sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-cream-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/app" className="flex items-center gap-2 md:hidden">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-lg text-foreground font-sans tracking-tight">NeuroNest</span>
          </Link>

          <div className="hidden sm:block text-xs font-medium text-muted-foreground">
            {quietMode ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-100 text-sage-700 font-semibold">
                🌿 Quiet Atmosphere Active
              </span>
            ) : (
              <span>Personalized sensory environment</span>
            )}
          </div>
        </div>

        {/* Accessibility Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Quiet Mode Quick Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuietMode(!quietMode)}
            className={`hidden sm:inline-flex rounded-xl gap-1.5 text-xs ${
              quietMode ? 'bg-sage-200 text-sage-800' : 'text-muted-foreground'
            }`}
            title="Toggle Quiet Mode to minimize sensory clutter"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{quietMode ? 'Quiet On' : 'Calm Mode'}</span>
          </Button>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEffects(!soundEnabled)}
            className="rounded-xl text-muted-foreground hover:text-foreground"
            title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-peach-500" />}
          </Button>

          {/* Comfort Center Button */}
          <Button
            variant="soft"
            size="sm"
            onClick={() => setComfortOpen(true)}
            className="rounded-xl gap-2 font-semibold text-xs sm:text-sm"
            aria-label="Open My Comfort & Accessibility Settings"
          >
            <Sliders className="w-4 h-4 text-primary" />
            <span>My Comfort</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area with Desktop Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarNav />
        </div>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 bg-card h-full shadow-2xl">
              <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 focus:outline-none">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? location.pathname === item.href : false;

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center gap-1 p-1 text-muted-foreground hover:text-primary focus:outline-none"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-semibold">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.href!}
              className={`flex flex-col items-center gap-1 p-1 transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
