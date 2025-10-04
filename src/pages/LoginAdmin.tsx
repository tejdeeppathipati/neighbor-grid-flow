import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });

        if (error) throw error;

        toast({
          title: 'Account created',
          description: 'You can now sign in immediately.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Set admin role in AuthContext after successful Supabase login
        login('admin');
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? 'Sign-up failed' : 'Sign-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupDemoUsers = async () => {
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-demo-users');
      
      if (error) throw error;
      
      toast({
        title: 'Demo users created!',
        description: 'You can now sign in with admin@demo.com or user@demo.com (password: demo123)',
      });
    } catch (error: any) {
      toast({
        title: 'Setup failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const isDisabled = !email || !password || loading;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-[520px]">
        <div 
          className="p-10 rounded-2xl"
          style={{ 
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Brand lockup */}
          <div className="flex items-start gap-3 mb-5">
            <div 
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ backgroundColor: 'var(--surface-2)' }}
            >
              <Zap className="h-4 w-4" style={{ color: 'var(--acc-green)' }} />
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                NeighborGrid
              </div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {isSignUp ? 'Admin Console Sign up' : 'Admin Console Sign in'}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>For microgrid operators</p>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: 'var(--surface-2)', 
                    color: 'var(--muted)',
                    border: '1px solid var(--border)'
                  }}
                >
                  Operator Access
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-sm" style={{ color: 'var(--text-dim)' }}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="mt-1 h-12"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: 'var(--radius-xl)'
                }}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm" style={{ color: 'var(--text-dim)' }}>Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 pr-10"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: 'var(--radius-xl)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
                  style={{ color: 'var(--muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isDisabled}
                className="w-full h-12 font-medium transition-all active:translate-y-px"
                variant="default"
              >
                {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create account' : 'Sign in')}
              </Button>
            </div>

            <div className="flex justify-between items-center text-sm pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1"
                style={{ color: 'var(--acc-cyan)' }}
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
              <Link
                to="/login/user"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1"
                style={{ color: 'var(--acc-cyan)' }}
              >
                Sign in as User
              </Link>
            </div>

            {/* Demo Setup Button - Prominent */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs text-center mb-2" style={{ color: 'var(--text-dim)' }}>
                First time here? Create demo accounts to get started
              </p>
              <Button
                type="button"
                onClick={setupDemoUsers}
                disabled={setupLoading}
                className="w-full h-12 font-semibold"
                style={{
                  backgroundColor: 'var(--acc-green)',
                  color: 'white'
                }}
              >
                {setupLoading ? 'Setting up demo users...' : '⚡ Setup Demo Users'}
              </Button>
              <p className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
                Creates: admin@demo.com & user@demo.com (password: demo123)
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
