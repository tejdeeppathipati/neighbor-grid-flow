import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AdminOverview } from '@/data/MockDataProvider';

interface FairRateCardProps {
  overview?: AdminOverview;
}

export function FairRateCard({ overview }: FairRateCardProps) {
  const { pricing } = overview;

  return (
    <Card className="p-6 bg-gradient-energy text-white">
      <h3 className="text-lg font-bold mb-4">Fair Rate Economics</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-90">Microgrid Fair Rate</span>
          <span className="text-xl font-bold">${pricing.fair_rate_per_kwh.toFixed(2)}/kWh</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
          <div>
            <div className="flex items-center gap-1 text-sm opacity-90 mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>Producer Earns</span>
            </div>
            <p className="text-lg font-bold">${pricing.fair_rate_per_kwh.toFixed(2)}</p>
            <p className="text-xs opacity-75">
              vs ${pricing.utility_export_per_kwh.toFixed(2)} grid export
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 text-sm opacity-90 mb-1">
              <TrendingDown className="h-3 w-3" />
              <span>Consumer Pays</span>
            </div>
            <p className="text-lg font-bold">${pricing.fair_rate_per_kwh.toFixed(2)}</p>
            <p className="text-xs opacity-75">
              vs ${pricing.utility_import_per_kwh.toFixed(2)} grid import
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/20">
          <p className="text-sm opacity-90">
            💡 Local sharing benefits both sides — producers earn {((pricing.fair_rate_per_kwh / pricing.utility_export_per_kwh - 1) * 100).toFixed(0)}% more, 
            consumers save {((1 - pricing.fair_rate_per_kwh / pricing.utility_import_per_kwh) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </Card>
  );
}
