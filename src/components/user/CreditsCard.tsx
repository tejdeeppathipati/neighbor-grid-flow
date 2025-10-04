import { Card } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';
import { formatCredits, formatKwh } from '@/lib/formatters';

interface CreditsCardProps {
  summary?: UserSummary;
}

export function CreditsCard({ summary }: CreditsCardProps) {
  const netCredits = summary?.credits_month_net_kwh || 0;
  const earnedToday = summary?.credits_today_earned_kwh || 0;
  const usedToday = summary?.credits_today_used_kwh || 0;

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h2 className="text-xl font-semibold text-[hsl(var(--text))]">Credits Balance</h2>
      </div>

      <div className="space-y-4">
        {/* Monthly Net */}
        <div className="text-center py-4 bg-[hsl(var(--surface-2))] rounded-lg">
          <p className="text-sm text-[hsl(var(--text-dim))] mb-1">Month-to-Date Net</p>
          <p className={`text-4xl font-semibold tabular-nums ${
            summary 
              ? netCredits >= 0 ? 'text-[hsl(var(--surplus))]' : 'text-[hsl(var(--consumption))]'
              : 'text-[hsl(var(--text-dim))]'
          }`}>
            {summary ? formatCredits(netCredits) : '—'}
            <span className="text-lg ml-1">kWh</span>
          </p>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-[hsl(var(--surplus))] mt-1" />
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))]">Earned Today</p>
              <p className="text-lg font-semibold text-[hsl(var(--surplus))] tabular-nums">
                +{summary ? formatKwh(earnedToday) : '—'} kWh
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="h-4 w-4 text-[hsl(var(--consumption))] mt-1" />
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))]">Used Today</p>
              <p className="text-lg font-semibold text-[hsl(var(--consumption))] tabular-nums">
                {summary ? formatKwh(usedToday) : '—'} kWh
              </p>
            </div>
          </div>
        </div>

        {/* Mini Ledger */}
        <div className="pt-4 border-t border-[hsl(var(--border))]">
          <h3 className="text-sm font-medium text-[hsl(var(--text-dim))] mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {earnedToday > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--text-dim))]">Shared to microgrid</span>
                <span className="text-[hsl(var(--surplus))] font-medium tabular-nums">+{formatKwh(earnedToday)} kWh</span>
              </div>
            )}
            {usedToday > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--text-dim))]">Received from microgrid</span>
                <span className="text-[hsl(var(--consumption))] font-medium tabular-nums">{formatKwh(usedToday)} kWh</span>
              </div>
            )}
            {earnedToday === 0 && usedToday === 0 && (
              <p className="text-sm text-[hsl(var(--text-dim))]">No activity today</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
