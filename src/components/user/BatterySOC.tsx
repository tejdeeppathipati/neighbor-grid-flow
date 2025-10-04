import { Card } from '@/components/ui/card';
import { Battery, TrendingUp, TrendingDown } from 'lucide-react';
import type { UserSummary } from '@/data/MockDataProvider';

interface BatterySOCProps {
  summary: UserSummary;
}

export function BatterySOC({ summary }: BatterySOCProps) {
  const percentage = summary.battery_soc_pct;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const batteryColor = 
    percentage > 60 ? 'text-surplus' :
    percentage > 30 ? 'text-consumption' :
    'text-destructive';

  return (
    <Card className="p-6 bg-gradient-card">
      <h2 className="text-xl font-bold mb-4">Battery Status</h2>
      
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
              className="text-muted"
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
            <span className={`text-2xl font-bold ${batteryColor}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-surplus mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Charged Today</p>
            <p className="text-lg font-bold text-surplus">
              {summary.battery_charge_today_kwh.toFixed(1)} kWh
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <TrendingDown className="h-4 w-4 text-consumption mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Discharged Today</p>
            <p className="text-lg font-bold text-consumption">
              {summary.battery_discharge_today_kwh.toFixed(1)} kWh
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
