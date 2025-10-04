import { Card } from '@/components/ui/card';
import { Battery, TrendingUp, TrendingDown } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';
import { formatPercent, formatKwh } from '@/lib/formatters';

interface BatterySOCProps {
  summary?: UserSummary;
}

export function BatterySOC({ summary }: BatterySOCProps) {
  const percentage = summary?.battery_soc_pct || 0;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const batteryColor = 
    percentage > 60 ? 'text-[hsl(var(--surplus))]' :
    percentage > 30 ? 'text-[hsl(var(--consumption))]' :
    'text-[hsl(var(--destructive))]';

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-4">Battery Status</h2>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-[hsl(var(--muted))]"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={batteryColor}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Battery className={`h-8 w-8 mb-1 ${batteryColor}`} />
            <span className={`text-2xl font-semibold tabular-nums ${batteryColor}`}>
              {summary ? formatPercent(percentage) : '—'}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--surplus))] mt-1" />
          <div>
            <p className="text-sm text-[hsl(var(--text-dim))]">Charged Today</p>
            <p className="text-lg font-semibold text-[hsl(var(--surplus))] tabular-nums">
              {summary?.battery_charge_today_kwh !== undefined ? formatKwh(summary.battery_charge_today_kwh) : '—'} kWh
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <TrendingDown className="h-4 w-4 text-[hsl(var(--consumption))] mt-1" />
          <div>
            <p className="text-sm text-[hsl(var(--text-dim))]">Discharged Today</p>
            <p className="text-lg font-semibold text-[hsl(var(--consumption))] tabular-nums">
              {summary?.battery_discharge_today_kwh !== undefined ? formatKwh(summary.battery_discharge_today_kwh) : '—'} kWh
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
