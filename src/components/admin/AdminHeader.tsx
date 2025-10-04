import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  microgridId: string;
}

export function AdminHeader({ microgridId }: AdminHeaderProps) {
  const { logout } = useAuth();

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--surface)',
      boxShadow: 'var(--shadow-soft)'
    }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-energy)' }}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>NeighborGrid</h1>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{microgridId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>Last update: —</span>
            <Badge variant="secondary" style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text)' }}>
              Admin
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              style={{ color: 'var(--text-dim)' }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
