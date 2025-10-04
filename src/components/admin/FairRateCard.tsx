import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AdminOverview } from '@/data/MockDataProvider';

interface FairRateCardProps {
  overview?: AdminOverview;
}

export function FairRateCard({ overview }: FairRateCardProps) {
  const fairRate = overview?.pricing.fair_rate_per_kwh;
  const utilityExport = overview?.pricing.utility_export_per_kwh;
  const utilityImport = overview?.pricing.utility_import_per_kwh;

  return (
    <Card className="p-6 bg-gradient-to-br from-[hsl(var(--acc-cyan))] to-[hsl(var(--acc-green))] text-white rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-glow)] border-0">
      <h2 className="text-xl font-semibold mb-4">Fair-Rate Economics</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Producer earns</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {fairRate !== undefined ? `$${fairRate.toFixed(2)}` : '—'}
            </p>
            <p className="text-xs opacity-80">
              vs {utilityExport !== undefined ? `$${utilityExport.toFixed(2)}` : '—'} export
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            <span className="text-sm">Consumer pays</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {fairRate !== undefined ? `$${fairRate.toFixed(2)}` : '—'}
            </p>
            <p className="text-xs opacity-80">
              vs {utilityImport !== undefined ? `$${utilityImport.toFixed(2)}` : '—'} import
            </p>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-sm opacity-90 text-center">
        Local sharing benefits both sides — producers earn more than export rate; neighbors pay less than import rate.
      </p>
    </Card>
  );
}
