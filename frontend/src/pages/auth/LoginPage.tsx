import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both your email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setFormError(err.message || 'Login failed. Please verify your credentials.');
    }
  };

  // Quick Demo account filler for rapid verification
  const fillDemo = (role: 'learner' | 'guardian' | 'admin') => {
    if (role === 'learner') {
      setEmail('alex.learner@neuronest.dev');
      setPassword('NeuroNest2026!');
    } else if (role === 'guardian') {
      setEmail('sarah.parent@neuronest.dev');
      setPassword('NeuroNest2026!');
    } else {
      setEmail('admin@neuronest.dev');
      setPassword('NeuroNestAdmin2026!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage-100 text-sage-600 text-2xl shadow-sm">
            🌱
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-foreground">
            Welcome to NeuroNest
          </h1>
          <p className="text-sm text-muted-foreground font-reading">
            A calm, encouraging space designed around your unique mind.
          </p>
        </div>

        {/* Card */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your account details below to access your space.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formError && (
                <div
                  className="p-3 rounded-xl bg-peach-100 border border-peach-200 text-peach-700 text-sm flex items-start gap-2.5 animate-in fade-in-50"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-peach-500" />
                  <span>{formError}</span>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-11 w-full rounded-xl border border-border bg-card px-4 py-2 pr-10 text-base text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Enter My Space
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline">
                  Create an account
                </Link>
              </div>

              {/* Demo Account Helper */}
              <div className="w-full pt-3 border-t border-border/80">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-lavender-500" /> Quick Demo Fill:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemo('learner')}
                    className="p-1.5 rounded-lg border border-border bg-cream-100 text-[11px] font-semibold hover:bg-cream-200"
                  >
                    Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('guardian')}
                    className="p-1.5 rounded-lg border border-border bg-cream-100 text-[11px] font-semibold hover:bg-cream-200"
                  >
                    Guardian
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('admin')}
                    className="p-1.5 rounded-lg border border-border bg-cream-100 text-[11px] font-semibold hover:bg-cream-200"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
