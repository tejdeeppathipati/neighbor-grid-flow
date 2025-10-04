import { Card } from '@/components/ui/card';
import { Zap, Home, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { AdminOverview } from '@/data/MockDataProvider';
import { formatKwh } from '@/lib/formatters';

interface CommunityTotalsProps {
  overview?: AdminOverview;
}

export function CommunityTotals({ overview }: CommunityTotalsProps) {
  const stats = [
    { 
      label: 'Production', 
      value: overview?.community_totals.production_kwh_today, 
      icon: Zap, 
      color: 'text-[hsl(var(--surplus))]' 
    },
    { 
      label: 'Microgrid Used', 
      value: overview?.community_totals.microgrid_used_kwh_today, 
      icon: Home, 
      color: 'text-[hsl(var(--battery))]' 
    },
    { 
      label: 'Grid Import', 
      value: overview?.community_totals.grid_import_kwh_today, 
      icon: ArrowDownLeft, 
      color: 'text-[hsl(var(--grid-import))]' 
    },
    { 
      label: 'Grid Export', 
      value: overview?.community_totals.grid_export_kwh_today, 
      icon: ArrowUpRight, 
      color: 'text-[hsl(var(--grid-export))]' 
    },
  ];

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-6">Community Totals (Today)</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-[hsl(var(--surface-2))] ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))] mb-1">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.color} tabular-nums`}>
                {stat.value !== undefined ? formatKwh(stat.value) : '—'}
                <span className="text-sm ml-1">kWh</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
