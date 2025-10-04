import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import type { UserForecast } from '@/data/MockDataProvider';
import { formatCredits } from '@/lib/formatters';
import { EmptyState } from '@/components/EmptyState';

interface MonthlyForecastProps {
  forecast?: UserForecast;
}

export function MonthlyForecast({ forecast }: MonthlyForecastProps) {
  if (!forecast || !forecast.days || forecast.days.length === 0) {
    return (
      <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
          <h2 className="text-xl font-semibold text-[hsl(var(--text))]">7-Day Forecast</h2>
        </div>
        <EmptyState icon={Calendar} title="No forecast data" caption="Connect backend to see predictions" />
      </Card>
    );
  }

  const data = forecast.days.map((day, idx) => ({
    day,
    solar: Math.round(forecast.solar_kwh[idx]),
    consumption: Math.round(forecast.consumption_kwh[idx]),
  }));

  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h2 className="text-xl font-semibold text-[hsl(var(--text))]">7-Day Forecast</h2>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
          <XAxis 
            dataKey="day" 
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
          <Line 
            type="monotone" 
            dataKey="solar" 
            stroke="hsl(var(--surplus))" 
            strokeWidth={2}
            name="Solar"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="consumption" 
            stroke="hsl(var(--consumption))" 
            strokeWidth={2}
            name="Consumption"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[hsl(var(--text-dim))]" />
            <span className="text-sm text-[hsl(var(--text-dim))]">Month-end projection</span>
          </div>
          <span className={`text-xl font-semibold tabular-nums ${
            forecast.credits_month_end_projection_kwh !== undefined
              ? forecast.credits_month_end_projection_kwh >= 0 ? 'text-[hsl(var(--surplus))]' : 'text-[hsl(var(--consumption))]'
              : 'text-[hsl(var(--text-dim))]'
          }`}>
            {forecast.credits_month_end_projection_kwh !== undefined 
              ? `${formatCredits(forecast.credits_month_end_projection_kwh)} kWh`
              : '— kWh'
            }
          </span>
        </div>
      </div>
    </Card>
  );
}
