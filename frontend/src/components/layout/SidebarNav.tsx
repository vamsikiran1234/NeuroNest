import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Gamepad2,
  BookOpen,
  CalendarCheck2,
  TrendingUp,
  Sparkles,
  Sliders,
  ShieldCheck,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAccessibilityStore } from '../../stores/accessibilityStore';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useAccessibilityStore((s) => s.presentationProfile);
  const simplified = useAccessibilityStore((s) => s.simplifiedNavigation);

  const navItems: NavItem[] = [
    { name: 'My Space', href: '/app', icon: LayoutDashboard },
    { name: 'Play & Explore', href: '/app/games', icon: Gamepad2, badge: '8 Games' },
    { name: 'Learning Corner', href: '/app/learning', icon: BookOpen },
    { name: 'Daily Journey', href: '/app/routines', icon: CalendarCheck2 },
    { name: 'My Growth', href: '/app/progress', icon: TrendingUp },
    { name: 'AI Learning Guide', href: '/app/assistant', icon: Sparkles },
    { name: 'My Comfort', href: '/app/comfort', icon: Sliders },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-full bg-card/70 backdrop-blur-md border-r border-border p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="font-bold text-lg font-sans tracking-tight leading-none text-foreground">
              NeuroNest
            </div>
            <div className="text-[11px] font-medium text-muted-foreground mt-0.5">
              Every mind finds its way
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/app'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/80 hover:bg-cream-200 hover:text-foreground'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-200/60 text-ink-900">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Support section */}
      <div className="space-y-3 pt-4 border-t border-border/80">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-cream-100/60 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-sm font-bold text-sage-700">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-foreground truncate">Alex Rivera</div>
            <div className="text-[10px] text-muted-foreground truncate capitalize">
              {profile.toLowerCase().replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
