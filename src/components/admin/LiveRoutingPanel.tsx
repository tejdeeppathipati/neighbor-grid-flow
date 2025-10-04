import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertCircle, Zap } from 'lucide-react';
import type { AdminLive } from '@/data/MockDataProvider';

interface LiveRoutingPanelProps {
  live: AdminLive;
}

export function LiveRoutingPanel({ live }: LiveRoutingPanelProps) {
  return (
    <Card className="p-6 bg-gradient-card">
      <h2 className="text-xl font-bold mb-4">Live Power Routing</h2>
      
      <div className="space-y-4">
        {/* Pairings Table */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Pairings</h3>
          <div className="space-y-2">
            {live.pairings.length > 0 ? (
              live.pairings.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-surplus-light/20 border border-surplus/20"
                >
                  <span className="font-medium">{pair.from}</span>
                  <ArrowRight className="h-4 w-4 text-surplus" />
                  <span className="font-medium">{pair.to}</span>
                  <span className="ml-auto text-sm font-bold text-surplus">
                    {pair.kw.toFixed(2)} kW
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active pairings</p>
            )}
          </div>
        </div>

        {/* Flow Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="border-grid-import text-grid-import">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unserved: {live.unserved_need_kw.toFixed(2)} kW
          </Badge>
          <Badge variant="outline" className="border-grid-export text-grid-export">
            <Zap className="mr-1 h-3 w-3" />
            To Grid: {live.sent_to_grid_kw.toFixed(2)} kW
          </Badge>
        </div>
      </div>
    </Card>
  );
}
