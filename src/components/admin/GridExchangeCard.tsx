import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, AlertCircle, Shield } from 'lucide-react';
import { formatKw, formatKwh } from '@/lib/formatters';

interface GridDrawer {
  id: string;
  kw: number;
}

interface GridExporter {
  id: string;
  kw: number;
}

interface GridExchangeCardProps {
  toGridNowKwTotal?: number;
  toGridTodayKwhTotal?: number;
  fromGridNowKwTotal?: number;
  gridDrawersNow: GridDrawer[];
  gridExportersNowTop?: GridExporter[];
  unservedNeedKw: number;
  isIslanded: boolean;
}

export function GridExchangeCard({
  toGridNowKwTotal,
  toGridTodayKwhTotal,
  fromGridNowKwTotal,
  gridDrawersNow,
  gridExportersNowTop,
  unservedNeedKw,
  isIslanded,
}: GridExchangeCardProps) {
  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <h2 className="text-xl font-semibold text-[hsl(var(--text))] mb-6">Grid Exchange (Now & Today)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - To Grid (Export) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-[hsl(var(--grid-export))]" />
            <h3 className="font-semibold text-[hsl(var(--text))]">To Grid (Export)</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))] mb-1">Now</p>
              <p className="text-4xl font-semibold text-[hsl(var(--grid-export))] tabular-nums">
                {toGridNowKwTotal !== undefined ? formatKw(toGridNowKwTotal) : '—'}
                <span className="text-lg ml-2">kW</span>
              </p>
            </div>
            
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))] mb-1">Today</p>
              <p className="text-xl font-semibold text-[hsl(var(--grid-export))]/80 tabular-nums">
                {toGridTodayKwhTotal !== undefined ? formatKwh(toGridTodayKwhTotal) : '—'}
                <span className="text-sm ml-1">kWh</span>
              </p>
            </div>

            {/* Top Exporters */}
            {gridExportersNowTop && gridExportersNowTop.length > 0 && (
              <div className="pt-3 border-t border-[hsl(var(--border))]/60">
                <p className="text-xs text-[hsl(var(--text-dim))] mb-2">Top exporters now</p>
                <div className="flex flex-wrap gap-2">
                  {gridExportersNowTop.slice(0, 3).map((exporter) => (
                    <Badge
                      key={exporter.id}
                      variant="outline"
                      className="border-[hsl(var(--grid-export))]/40 text-[hsl(var(--grid-export))] bg-[hsl(var(--grid-export))]/10 tabular-nums"
                    >
                      {exporter.id} {formatKw(exporter.kw)} kW
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - From Grid (Import) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-5 w-5 text-[hsl(var(--grid-import))]" />
            <h3 className="font-semibold text-[hsl(var(--text))]">From Grid (Import)</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[hsl(var(--text-dim))] mb-1">Now (Total)</p>
              <p className="text-4xl font-semibold text-[hsl(var(--grid-import))] tabular-nums">
                {fromGridNowKwTotal !== undefined ? formatKw(fromGridNowKwTotal) : '—'}
                <span className="text-lg ml-2">kW</span>
              </p>
            </div>

            {/* Houses Drawing Now */}
            {gridDrawersNow.length > 0 ? (
              <div className="pt-3 border-t border-[hsl(var(--border))]/60">
                <p className="text-xs text-[hsl(var(--text-dim))] mb-2">Houses drawing now</p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {gridDrawersNow.map((drawer) => (
                    <div
                      key={drawer.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[hsl(var(--grid-import))]/10 border border-[hsl(var(--grid-import))]/20"
                    >
                      <span className="font-medium text-[hsl(var(--text))]">{drawer.id}</span>
                      <span className="text-sm font-semibold text-[hsl(var(--grid-import))] tabular-nums">
                        {formatKw(drawer.kw)} kW
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[hsl(var(--text-dim))] pt-3 border-t border-[hsl(var(--border))]/60">
                No houses importing from grid
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Chips */}
      <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[hsl(var(--border))]/60">
        {unservedNeedKw > 0 && (
          <Badge variant="outline" className="border-[hsl(var(--grid-import))] text-[hsl(var(--grid-import))] bg-[hsl(var(--grid-import))]/10">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unserved: {formatKw(unservedNeedKw)} kW
          </Badge>
        )}
        {isIslanded && (
          <Badge variant="outline" className="border-[hsl(var(--consumption))] text-[hsl(var(--consumption))] bg-[hsl(var(--consumption))]/10">
            <Shield className="mr-1 h-3 w-3" />
            Islanded
          </Badge>
        )}
      </div>
    </Card>
  );
}
