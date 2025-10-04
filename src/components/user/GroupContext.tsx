import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Users, Zap } from 'lucide-react';
import type { UserSharing } from '@/data/MockDataProvider';
import { formatKw } from '@/lib/formatters';

interface GroupContextProps {
  sharing?: UserSharing;
}

export function GroupContext({ sharing }: GroupContextProps) {
  return (
    <Card className="p-6 bg-[hsl(var(--surface))] rounded-[var(--radius-xl,16px)] shadow-[var(--shadow-card)] border border-[hsl(var(--border))]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-[hsl(var(--primary))]" />
        <h2 className="text-xl font-semibold text-[hsl(var(--text))]">Microgrid Sharing</h2>
      </div>

      <div className="space-y-4">
        {/* Current Flow */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="h-4 w-4 text-[hsl(var(--surplus))]" />
              <span className="text-sm text-[hsl(var(--text-dim))]">Sharing Now</span>
            </div>
            <p className="text-2xl font-semibold text-[hsl(var(--surplus))] tabular-nums">
              {sharing?.to_microgrid_now_kw !== undefined ? formatKw(sharing.to_microgrid_now_kw) : '—'} kW
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="h-4 w-4 text-[hsl(var(--consumption))]" />
              <span className="text-sm text-[hsl(var(--text-dim))]">Receiving Now</span>
            </div>
            <p className="text-2xl font-semibold text-[hsl(var(--consumption))] tabular-nums">
              {sharing?.from_microgrid_now_kw !== undefined ? formatKw(sharing.from_microgrid_now_kw) : '—'} kW
            </p>
          </div>
        </div>

        {/* Partners */}
        <div className="pt-4 border-t border-[hsl(var(--border))]">
          {sharing?.partners.to && sharing.partners.to.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-[hsl(var(--text-dim))] mb-2">Sharing with:</p>
              <div className="flex flex-wrap gap-2">
                {sharing.partners.to.map(partner => (
                  <Badge key={partner} variant="outline" className="border-[hsl(var(--surplus))] text-[hsl(var(--surplus))]">
                    {partner}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {sharing?.partners.from && sharing.partners.from.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-[hsl(var(--text-dim))] mb-2">Receiving from:</p>
              <div className="flex flex-wrap gap-2">
                {sharing.partners.from.map(partner => (
                  <Badge key={partner} variant="outline" className="border-[hsl(var(--consumption))] text-[hsl(var(--consumption))]">
                    {partner}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {(!sharing || (sharing.partners.to.length === 0 && sharing.partners.from.length === 0)) && (
            <p className="text-sm text-[hsl(var(--text-dim))]">No active sharing</p>
          )}
        </div>

        {/* Unused Surplus */}
        {sharing && sharing.unused_surplus_to_grid_now_kw > 0 && (
          <div className="pt-4 border-t border-[hsl(var(--border))]">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--grid-export))]/10 border border-[hsl(var(--grid-export))]/20">
              <Zap className="h-4 w-4 text-[hsl(var(--grid-export))]" />
              <div className="flex-1">
                <p className="text-sm text-[hsl(var(--text-dim))]">Unused surplus → grid</p>
                <p className="text-lg font-semibold text-[hsl(var(--grid-export))] tabular-nums">
                  {formatKw(sharing.unused_surplus_to_grid_now_kw)} kW
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
