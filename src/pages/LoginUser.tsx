import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function LoginUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/app');
    } catch (error: any) {
      toast({
        title: 'Sign-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !email || !password || loading;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-[440px]">
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
              <Home className="h-4 w-4" style={{ color: 'var(--acc-green)' }} />
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                NeighborGrid
              </div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Sign in to NeighborGrid
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>For homeowners</p>
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
                placeholder="your@email.com"
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
                className="w-full h-12 text-white font-medium transition-all active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: isDisabled ? 'var(--surface-2)' : 'var(--acc-green)',
                  color: isDisabled ? 'var(--muted)' : 'white',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: isDisabled ? 'none' : 'var(--shadow-soft)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className="flex justify-between items-center text-sm pt-1">
              <Link
                to="/login/admin"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1"
                style={{ color: 'var(--acc-cyan)' }}
              >
                Sign in as Admin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
