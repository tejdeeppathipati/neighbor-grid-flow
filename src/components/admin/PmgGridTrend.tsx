import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AdminTrends } from '@/data/MockDataProvider';
import { formatNumber } from '@/lib/formatters';
import { EmptyState } from '@/components/EmptyState';
import { TrendingUp } from 'lucide-react';

interface PmgGridTrendProps {
  trends?: AdminTrends;
}

export function PmgGridTrend({ trends }: PmgGridTrendProps) {
  if (!trends || !trends.times || trends.times.length === 0) {
    return (
      <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
        <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-4">Energy Flow Trend (Today)</h2>
        <EmptyState icon={TrendingUp} title="No data yet" caption="Connect backend to see live updates" />
      </Card>
    );
  }

  const data = trends.times.map((time, idx) => ({
    time,
    production: formatNumber(trends.production_kwh[idx]),
    microgrid: formatNumber(trends.microgrid_used_kwh[idx]),
    grid: formatNumber(trends.grid_kwh[idx]),
  }));

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-4">Energy Flow Trend (Today)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--surplus))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--surplus))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="microgridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--battery))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--battery))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--consumption))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--consumption))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--text-dim))"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="hsl(var(--text-dim))"
            style={{ fontSize: '12px' }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: 'hsl(var(--text-dim))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="production"
            stroke="hsl(var(--surplus))"
            strokeWidth={2}
            fill="url(#productionGradient)"
            name="Production"
          />
          <Area
            type="monotone"
            dataKey="microgrid"
            stroke="hsl(var(--battery))"
            strokeWidth={2}
            fill="url(#microgridGradient)"
            name="Microgrid Used"
          />
          <Area
            type="monotone"
            dataKey="grid"
            stroke="hsl(var(--consumption))"
            strokeWidth={2}
            fill="url(#gridGradient)"
            name="Grid"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
