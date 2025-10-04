import { RoleSwitcher } from '@/components/RoleSwitcher';
import { Zap } from 'lucide-react';

interface AdminHeaderProps {
  microgridId: string;
  lastUpdate?: string;
}

export function AdminHeader({ microgridId, lastUpdate }: AdminHeaderProps) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--acc-green))] to-[hsl(var(--acc-cyan))]">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[hsl(var(--text))]">NeighborGrid</h1>
              <p className="text-sm text-[hsl(var(--text-dim))]">{microgridId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[hsl(var(--text-dim))]">
              Last update: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '—'}
            </span>
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
