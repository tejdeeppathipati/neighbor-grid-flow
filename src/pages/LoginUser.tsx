import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginUser() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('demo123');
  const [homeId, setHomeId] = useState('H7');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Sign-in wiring coming next',
      description: 'This is a UI placeholder.',
    });
    login('user', homeId || 'H1');
    navigate('/app');
  };

  const isDisabled = !email || !password;

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

          {/* Demo credentials helper */}
          <div 
            className="p-3 rounded-lg mb-5"
            style={{ 
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)'
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>
              Demo Credentials
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Email: user@demo.com<br />
              Password: demo123<br />
              Home ID: H7
            </p>
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

            <div>
              <Label htmlFor="homeId" className="text-sm" style={{ color: 'var(--text-dim)' }}>
                Home ID <span style={{ color: 'var(--muted)' }}>(optional)</span>
              </Label>
              <Input
                id="homeId"
                type="text"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                placeholder="e.g., H7"
                className="mt-1 h-12"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  borderRadius: 'var(--radius-xl)'
                }}
              />
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
                Sign in
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
              <button
                type="button"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded px-1"
                style={{ color: 'var(--text-dim)' }}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
