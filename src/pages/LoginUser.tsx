import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Sign-in wiring coming next. This is a UI placeholder.');
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] flex">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--surface-2))] items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--acc-green))] to-[hsl(var(--acc-cyan))] flex items-center justify-center">
              <Leaf className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-[hsl(var(--text))] mb-4">
            Power Your Neighborhood
          </h2>
          <p className="text-[hsl(var(--text-dim))] text-lg">
            Share clean energy locally, reduce grid dependence, and build a sustainable future together.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] p-8 border border-[hsl(var(--border))]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[hsl(var(--text))] mb-2">
                Sign in to NeighborGrid
              </h1>
              <p className="text-[hsl(var(--text-dim))]">For homeowners</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--text))]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-[hsl(var(--border))]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(var(--text))]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-[hsl(var(--border))] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-dim))] hover:text-[hsl(var(--text))]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[hsl(var(--acc-green))] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-[hsl(var(--acc-green))] text-white hover:opacity-90 disabled:opacity-50"
              >
                Sign in
              </Button>

              <div className="text-center pt-4 border-t border-[hsl(var(--border))]">
                <Link
                  to="/login/admin"
                  className="text-sm text-[hsl(var(--acc-green))] hover:underline"
                >
                  Sign in as Admin
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
