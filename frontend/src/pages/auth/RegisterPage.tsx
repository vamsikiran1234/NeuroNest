import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { AlertCircle, User, Users, Shield } from 'lucide-react';

export function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ROLE_USER' | 'ROLE_PARENT_OR_GUARDIAN'>('ROLE_USER');
  const [isMinor, setIsMinor] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await register({
        displayName,
        email,
        password,
        role,
        minor: isMinor,
      });
      // Direct new users into onboarding to personalize their environment
      navigate('/onboarding');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage-100 text-sage-600 text-2xl shadow-sm">
            🌱
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-foreground">
            Join NeuroNest
          </h1>
          <p className="text-sm text-muted-foreground font-reading">
            Create an account to explore personalized learning, games, and daily routines.
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              We do not ask for or store medical diagnoses. Personalization is always based on your choices.
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

              {/* Role selection */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">I am joining as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setRole('ROLE_USER'); }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col items-start gap-2 ${
                      role === 'ROLE_USER'
                        ? 'border-primary bg-sage-50 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Learner</div>
                      <div className="text-[10px] text-muted-foreground">For myself</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRole('ROLE_PARENT_OR_GUARDIAN'); setIsMinor(false); }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col items-start gap-2 ${
                      role === 'ROLE_PARENT_OR_GUARDIAN'
                        ? 'border-primary bg-sage-50 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-cream-100'
                    }`}
                  >
                    <Users className="w-5 h-5 text-lavender-500" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Parent / Guardian</div>
                      <div className="text-[10px] text-muted-foreground">Supporting family</div>
                    </div>
                  </button>
                </div>
              </div>

              <Input
                label="Preferred Name or Nickname"
                placeholder="e.g. Alex"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password (at least 8 characters)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {role === 'ROLE_USER' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-cream-100 border border-border">
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">I am under 18 years old</div>
                    <div className="text-muted-foreground">Enables age-appropriate privacy safeguards</div>
                  </div>
                  <Switch
                    checked={isMinor}
                    onCheckedChange={setIsMinor}
                    aria-label="Toggle under 18 status"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Create Account &amp; Personalize
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
