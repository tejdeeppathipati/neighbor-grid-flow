/**
 * HomePopover - Detailed view popup for selected home
 */

import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { HomeNodeData } from './NeighborhoodMap';

interface HomePopoverProps {
  home: HomeNodeData;
  open: boolean;
  onClose: () => void;
}

export function HomePopover({ home, open, onClose }: HomePopoverProps) {
  if (!open) return null;

  const netExport = home.export_kw - home.import_kw;
  const isExporting = netExport > 0.1;
  const isImporting = netExport < -0.1;

  const getSocColor = (soc: number) => {
    if (soc < 20) return 'text-red-500';
    if (soc < 60) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 animate-fade-in">
      <Card className="w-[400px] max-w-[90vw] shadow-2xl animate-scale-in">
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-mono">{home.id}</CardTitle>
              <div className="flex gap-2 mt-2">
                {home.status === 'islanded' && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    ⚡ Islanded
                  </Badge>
                )}
                {home.status === 'outage' && (
                  <Badge variant="destructive">
                    ⚠ Outage
                  </Badge>
                )}
                {isExporting && (
                  <Badge className="bg-green-100 text-green-800">
                    ↑ Exporting
                  </Badge>
                )}
                {isImporting && (
                  <Badge className="bg-red-100 text-red-800">
                    ↓ Importing
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Energy Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Solar Production</div>
              <div className="text-2xl font-bold text-yellow-600">
                {home.pv_kw.toFixed(1)} <span className="text-sm">kW</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Home Load</div>
              <div className="text-2xl font-bold">
                {home.load_kw.toFixed(1)} <span className="text-sm">kW</span>
              </div>
            </div>
          </div>

          {/* Battery SOC */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Battery State of Charge</div>
              <div className={`text-lg font-bold ${getSocColor(home.soc_pct)}`}>
                {home.soc_pct}%
              </div>
            </div>
            <Progress value={home.soc_pct} className="h-2" />
          </div>

          {/* Grid Exchange */}
          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Grid Exchange</div>
              <div className={`font-semibold ${isExporting ? 'text-green-600' : isImporting ? 'text-red-600' : ''}`}>
                {isExporting && `↑ Exporting ${netExport.toFixed(1)} kW`}
                {isImporting && `↓ Importing ${Math.abs(netExport).toFixed(1)} kW`}
                {!isExporting && !isImporting && 'Balanced'}
              </div>
            </div>
          </div>

          {/* Microgrid Sharing */}
          {(home.sharing_kw > 0 || home.receiving_kw > 0) && (
            <div className="pt-3 border-t space-y-2">
              <div className="text-xs text-muted-foreground font-semibold">Microgrid Activity</div>
              {home.sharing_kw > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Sharing to neighbors</div>
                  <div className="font-semibold text-green-600">
                    {home.sharing_kw.toFixed(1)} kW
                  </div>
                </div>
              )}
              {home.receiving_kw > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">Receiving from neighbors</div>
                  <div className="font-semibold text-blue-600">
                    {home.receiving_kw.toFixed(1)} kW
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Net balance */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Net Power Balance</div>
              <div className={`text-lg font-bold ${
                home.pv_kw - home.load_kw > 0 ? 'text-green-600' : 
                home.pv_kw - home.load_kw < 0 ? 'text-red-600' : ''
              }`}>
                {(home.pv_kw - home.load_kw > 0 ? '+' : '')}
                {(home.pv_kw - home.load_kw).toFixed(1)} kW
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
