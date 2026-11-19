import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../api/client';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch {
      // Intentionally acknowledge without revealing user existence
    } finally {
      setIsLoading(false);
      setSubmitted(true);
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
            Account Recovery
          </h1>
        </div>

        <Card className="border-border shadow-md">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-sage-100 text-primary flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If an account matches <strong>{email}</strong>, a recovery link has been dispatched with instructions to safely reset your password.
              </p>
              <Link to="/login" className="inline-block pt-2">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl">Reset your password</CardTitle>
                <CardDescription>
                  Enter your registered email address and we will send you a reset link.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                  Send Recovery Link
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <Link to="/login" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
