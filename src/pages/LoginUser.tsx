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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeId, setHomeId] = useState('');
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
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left panel - illustration */}
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
        style={{ backgroundColor: 'var(--surface-2)' }}
      >
        <div className="max-w-md">
          <div className="w-64 h-64 mx-auto opacity-40">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20L60 50V90L100 120L140 90V50L100 20Z" stroke="var(--acc-green)" strokeWidth="2" fill="var(--acc-green)" fillOpacity="0.1"/>
              <path d="M100 80L80 95V125L100 140L120 125V95L100 80Z" stroke="var(--acc-cyan)" strokeWidth="2" fill="var(--acc-cyan)" fillOpacity="0.1"/>
              <circle cx="100" cy="100" r="60" stroke="var(--acc-green)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ 
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'var(--gradient-energy)' }}
              >
                <Home className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                NeighborGrid
              </h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Sign in to NeighborGrid
            </h2>
            <p style={{ color: 'var(--text-dim)' }}>For homeowners</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" style={{ color: 'var(--text)' }}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                style={{
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <div>
              <Label htmlFor="password" style={{ color: 'var(--text)' }}>Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="homeId" style={{ color: 'var(--text)' }}>
                Home ID <span style={{ color: 'var(--muted)' }}>(optional)</span>
              </Label>
              <Input
                id="homeId"
                type="text"
                value={homeId}
                onChange={(e) => setHomeId(e.target.value)}
                placeholder="e.g., H7"
                className="mt-1"
                style={{
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full text-white font-medium"
              style={{
                backgroundColor: 'var(--acc-green)',
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              Sign in
            </Button>

            <div className="space-y-3 text-center text-sm">
              <Link
                to="/login/admin"
                className="block hover:underline"
                style={{ color: 'var(--acc-cyan)' }}
              >
                Sign in as Admin
              </Link>
              <button
                type="button"
                className="hover:underline"
                style={{ color: 'var(--muted)' }}
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
