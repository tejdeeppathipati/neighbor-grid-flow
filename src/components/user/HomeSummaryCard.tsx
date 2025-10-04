import { Card } from '@/components/ui/card';
import { Sun, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';
import { formatKw, formatKwh } from '@/lib/formatters';

interface HomeSummaryCardProps {
  summary?: UserSummary;
}

export function HomeSummaryCard({ summary }: HomeSummaryCardProps) {
  const stats = [
    {
      label: 'Solar Production',
      now: summary?.solar_now_kw,
      today: summary?.solar_today_kwh,
      icon: Sun,
      color: 'text-[hsl(var(--surplus))]',
      bgColor: 'bg-[hsl(var(--surplus-light))]',
    },
    {
      label: 'Consumption',
      now: summary?.consumption_now_kw,
      today: summary?.consumption_today_kwh,
      icon: Zap,
      color: 'text-[hsl(var(--consumption))]',
      bgColor: 'bg-[hsl(var(--consumption-light))]',
    },
  ];

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-4">Energy Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[hsl(var(--text-dim))] mb-1">{stat.label}</p>
              <p className={`text-3xl font-semibold ${stat.color} tabular-nums`}>
                {stat.now !== undefined ? formatKw(stat.now) : '—'}
                <span className="text-lg ml-1">kW</span>
              </p>
              <p className="text-sm text-[hsl(var(--text-dim))] mt-1 tabular-nums">
                {stat.today !== undefined ? formatKwh(stat.today) : '—'} kWh today
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[hsl(var(--text-dim))]">Surplus Today</span>
          <div className="flex items-center gap-2">
            {summary?.surplus_today_kwh !== undefined && summary.surplus_today_kwh >= 0 ? (
              <TrendingUp className="h-4 w-4 text-[hsl(var(--surplus))]" />
            ) : summary?.surplus_today_kwh !== undefined ? (
              <TrendingDown className="h-4 w-4 text-[hsl(var(--consumption))]" />
            ) : null}
            <span className={`text-xl font-semibold tabular-nums ${
              summary?.surplus_today_kwh !== undefined
                ? summary.surplus_today_kwh >= 0 ? 'text-[hsl(var(--surplus))]' : 'text-[hsl(var(--consumption))]'
                : 'text-[hsl(var(--text-dim))]'
            }`}>
              {summary?.surplus_today_kwh !== undefined 
                ? `${summary.surplus_today_kwh >= 0 ? '+' : ''}${formatKwh(summary.surplus_today_kwh)} kWh`
                : '— kWh'
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
