import { Card } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';
import { formatCredits, formatKwh } from '@/lib/formatters';

interface CreditsCardProps {
  summary: UserSummary;
}

export function CreditsCard({ summary }: CreditsCardProps) {
  return (
    <Card className="p-6 bg-gradient-card">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Credits Balance</h2>
      </div>

      <div className="space-y-4">
        {/* Monthly Net */}
        <div className="text-center py-4 bg-gradient-hero rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Month-to-Date Net</p>
          <p className={`text-4xl font-bold tabular-nums ${summary.credits_month_net_kwh >= 0 ? 'text-surplus' : 'text-consumption'}`}>
            {formatCredits(summary.credits_month_net_kwh)}
            <span className="text-lg ml-1">kWh</span>
          </p>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-surplus mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Earned Today</p>
              <p className="text-lg font-bold text-surplus tabular-nums">
                +{formatKwh(summary.credits_today_earned_kwh)} kWh
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="h-4 w-4 text-consumption mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Used Today</p>
              <p className="text-lg font-bold text-consumption tabular-nums">
                {formatKwh(summary.credits_today_used_kwh)} kWh
              </p>
            </div>
          </div>
        </div>

        {/* Mini Ledger */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {summary.credits_today_earned_kwh > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shared to microgrid</span>
                <span className="text-surplus font-medium tabular-nums">+{formatKwh(summary.credits_today_earned_kwh)} kWh</span>
              </div>
            )}
            {summary.credits_today_used_kwh > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Received from microgrid</span>
                <span className="text-consumption font-medium tabular-nums">{formatKwh(summary.credits_today_used_kwh)} kWh</span>
              </div>
            )}
            {summary.credits_today_earned_kwh === 0 && summary.credits_today_used_kwh === 0 && (
              <p className="text-sm text-muted-foreground">No activity today</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
