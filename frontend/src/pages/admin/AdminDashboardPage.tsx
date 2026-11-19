import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  ShieldAlert,
  Users,
  Database,
  Activity,
  Server,
  Lock,
  Search,
  CheckCircle2,
  Cpu,
  Sparkles,
  Gamepad2,
  Calendar,
} from 'lucide-react';

interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  minor: boolean;
  createdAt: string;
}

interface MockAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  details: string;
}

const MOCK_USERS: MockUser[] = [
  { id: 'u1', email: 'vamsikiran@neuronest.dev', displayName: 'Vamsi Kiran', role: 'ROLE_ADMIN', minor: false, createdAt: '2026-11-19' },
  { id: 'u2', email: 'parent@neuronest.dev', displayName: 'Sarah Parent', role: 'ROLE_PARENT_OR_GUARDIAN', minor: false, createdAt: '2026-11-19' },
  { id: 'u3', email: 'leo@neuronest.dev', displayName: 'Leo', role: 'ROLE_USER', minor: true, createdAt: '2026-11-19' },
  { id: 'u4', email: 'alex@neuronest.dev', displayName: 'Alex Explorer', role: 'ROLE_USER', minor: false, createdAt: '2026-11-19' },
  { id: 'u5', email: 'sam@neuronest.dev', displayName: 'Sam Reader', role: 'ROLE_USER', minor: false, createdAt: '2026-11-19' },
];

const MOCK_AUDIT_LOGS: MockAuditLog[] = [
  { id: 'l1', timestamp: '12:15:00', actor: 'parent@neuronest.dev', action: 'UPDATE_CONSENT', entity: 'ConsentRecord', details: 'Confirmed minor account creation' },
  { id: 'l2', timestamp: '12:10:22', actor: 'leo@neuronest.dev', action: 'COMPLETE_GAME', entity: 'GameSession', details: 'Completed Memory Garden (Score: 100)' },
  { id: 'l3', timestamp: '12:05:14', actor: 'alex@neuronest.dev', action: 'COMPLETE_ROUTINE_STEP', entity: 'RoutineStep', details: 'Completed "Drink warm water"' },
  { id: 'l4', timestamp: '11:45:00', actor: 'vamsikiran@neuronest.dev', action: 'ADMIN_LOGIN', entity: 'AuthSession', details: 'Admin authentication success' },
];

export function AdminDashboardPage() {
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesQuery =
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-ink-900 via-ink-800 to-dusty-900 text-white p-6 sm:p-8 border border-ink-700 shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cream-200 text-xs font-bold border border-white/20">
            <ShieldAlert className="w-3.5 h-3.5 text-sage-400" />
            System Administration & RBAC
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Platform Administration
          </h1>
          <p className="text-sm text-cream-200/80 font-reading leading-relaxed">
            Monitor real-time system telemetry, database health, user directory, and security audit logs across the NeuroNest ecosystem.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 rounded-3xl border-border bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Total Users</span>
            <Users className="w-4 h-4 text-sage-600" />
          </div>
          <p className="text-2xl font-black text-foreground">{MOCK_USERS.length}</p>
          <span className="text-[11px] text-sage-700 font-bold block">1 Minor Account Protected</span>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Games Completed</span>
            <Gamepad2 className="w-4 h-4 text-peach-600" />
          </div>
          <p className="text-2xl font-black text-foreground">142</p>
          <span className="text-[11px] text-muted-foreground block">8 Core Games Active</span>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Routines Nurtured</span>
            <Calendar className="w-4 h-4 text-dusty-600" />
          </div>
          <p className="text-2xl font-black text-foreground">89</p>
          <span className="text-[11px] text-muted-foreground block">100% Non-Punitive</span>
        </Card>

        <Card className="p-5 rounded-3xl border-border bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">AI Uptime & Fallback</span>
            <Sparkles className="w-4 h-4 text-lavender-600" />
          </div>
          <p className="text-2xl font-black text-foreground">100%</p>
          <span className="text-[11px] text-sage-700 font-bold block">Zero Offline Blockers</span>
        </Card>
      </div>

      {/* System Infrastructure Health */}
      <Card className="p-6 rounded-3xl border-border bg-white space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Server className="w-4 h-4 text-sage-600" /> Infrastructure & Service Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-cream-50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-dusty-600" />
              <div>
                <p className="text-xs font-bold text-foreground">PostgreSQL 16</p>
                <p className="text-[11px] text-muted-foreground font-reading">Flyway V1, V2 Migrations</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-peach-600" />
              <div>
                <p className="text-xs font-bold text-foreground">Spring Security & JWT</p>
                <p className="text-[11px] text-muted-foreground font-reading">RBAC & Refresh Tokens</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-lavender-600" />
              <div>
                <p className="text-xs font-bold text-foreground">Gemini GenAI Engine</p>
                <p className="text-[11px] text-muted-foreground font-reading">Deterministic Fallbacks</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-pulse" />
          </div>
        </div>
      </Card>

      {/* User Directory Table */}
      <Card className="p-6 rounded-3xl border-border bg-white space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-dusty-600" /> User Directory
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-9 h-8 text-xs bg-cream-50 w-48"
              />
            </div>

            <select
              aria-label="Filter Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-border bg-cream-50 text-xs font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_PARENT_OR_GUARDIAN">Guardian</option>
              <option value="ROLE_USER">User</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-bold">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Minor Account</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-reading">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-foreground">{u.displayName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{u.email}</p>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-ink-100 text-ink-900 border-ink-300'
                          : u.role === 'ROLE_PARENT_OR_GUARDIAN'
                          ? 'bg-peach-100 text-peach-900 border-peach-300'
                          : 'bg-sage-100 text-sage-900 border-sage-300'
                      }`}
                    >
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.minor ? (
                      <span className="text-dusty-700 font-bold">✓ Yes (Parental Linked)</span>
                    ) : (
                      <span className="text-muted-foreground">Standard</span>
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground font-mono">{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Audit Log */}
      <Card className="p-6 rounded-3xl border-border bg-white space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-peach-600" /> Recent Security & Platform Audit Log
        </h3>

        <div className="space-y-2">
          {MOCK_AUDIT_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-cream-50/60 border border-border flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">({log.entity})</span>
                </div>
                <p className="text-muted-foreground font-reading">{log.details}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-muted-foreground block">{log.actor}</span>
                <span className="text-[10px] text-muted-foreground/80 font-mono">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
