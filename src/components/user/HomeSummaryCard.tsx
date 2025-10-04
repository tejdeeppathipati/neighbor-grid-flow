import { Card } from '@/components/ui/card';
import { Sun, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';

interface HomeSummaryCardProps {
  summary: UserSummary;
}

export function HomeSummaryCard({ summary }: HomeSummaryCardProps) {
  const stats = [
    {
      label: 'Solar Production',
      now: summary.solar_now_kw,
      today: summary.solar_today_kwh,
      icon: Sun,
      color: 'text-surplus',
      bgColor: 'bg-surplus-light',
    },
    {
      label: 'Consumption',
      now: summary.consumption_now_kw,
      today: summary.consumption_today_kwh,
      icon: Zap,
      color: 'text-consumption',
      bgColor: 'bg-consumption-light',
    },
  ];

  return (
    <Card className="p-6 bg-gradient-card">
      <h2 className="text-xl font-bold mb-4">Energy Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.now.toFixed(2)}
                <span className="text-lg ml-1">kW</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.today.toFixed(1)} kWh today
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Surplus Today</span>
          <div className="flex items-center gap-2">
            {summary.surplus_today_kwh >= 0 ? (
              <TrendingUp className="h-4 w-4 text-surplus" />
            ) : (
              <TrendingDown className="h-4 w-4 text-consumption" />
            )}
            <span className={`text-xl font-bold ${summary.surplus_today_kwh >= 0 ? 'text-surplus' : 'text-consumption'}`}>
              {summary.surplus_today_kwh >= 0 ? '+' : ''}{summary.surplus_today_kwh.toFixed(1)} kWh
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
