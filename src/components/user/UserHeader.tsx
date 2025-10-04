import { RoleSwitcher } from '@/components/RoleSwitcher';
import { TickControls } from '@/components/TickControls';
import { Home, Zap } from 'lucide-react';

interface UserHeaderProps {
  homeId: string;
  lastUpdate?: string;
  onTick: () => void;
}

export function UserHeader({ homeId, lastUpdate, onTick }: UserHeaderProps) {
  return (
    <header className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-energy">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Home</h1>
              <p className="text-sm text-muted-foreground">NeighborGrid • {homeId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TickControls onTick={onTick} lastUpdate={lastUpdate} />
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
