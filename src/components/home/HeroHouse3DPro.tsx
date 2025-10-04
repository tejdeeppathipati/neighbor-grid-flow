import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SolarPill, HomePill, BatteryPill, GridPill } from './StatPill';
import { HouseGlyph, getHouseAnchors } from './HouseGlyph';
import { calculateFlowPaths } from './flowHelpers';
import { TOKENS } from './tokens';

interface HeroHouse3DProProps {
  pvKw: number;
  loadKw: number;
  socPct: number;
  reservePct?: number;
  expKw: number;
  impKw: number;
  shareKw: number;
  recvKw: number;
  updatedAt?: Date;
  className?: string;
}

export function HeroHouse3DPro({
  pvKw,
  loadKw,
  socPct,
  reservePct = 0,
  expKw,
  impKw,
  shareKw,
  recvKw,
  updatedAt,
  className = ""
}: HeroHouse3DProProps) {
  
  // Calculate house anchors and flow paths
  const anchors = useMemo(() => getHouseAnchors(500, 400), []);
  
  const flows = useMemo(() => 
    calculateFlowPaths(
      pvKw,
      loadKw,
      socPct,
      impKw,
      expKw,
      shareKw,
      recvKw,
      anchors
    ), [pvKw, loadKw, socPct, impKw, expKw, shareKw, recvKw, anchors]
  );

  return (
    <Card 
      className={`rounded-3xl border bg-white p-6 md:p-8 shadow-sm relative overflow-hidden ${className}`}
      style={{ 
        borderRadius: TOKENS.radius,
        boxShadow: TOKENS.shadow,
        minHeight: '440px',
      }}
    >
      <div className="relative">
        {/* Main PNG Container - House and Car Side by Side */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-8">
          {/* House Section */}
          <div className="relative">
            <HouseGlyph 
              pvKw={pvKw}
              socPct={socPct}
              width={500}
              height={400}
            />
          </div>

          {/* Car Section - Bigger, closer, darker, and positioned lower */}
          <div className="flex items-end">
            <img
              src="/cybertruck.png"
              alt="Tesla Cybertruck"
              className="w-48 md:w-56 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
              style={{
                transform: 'translateX(-20px) translateY(20px)'
              }}
            />
          </div>
        </div>

        {/* Stat Pills positioned around the hero - Better alignment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: '24px' }}>
          {/* Top Left - Solar */}
          <div className="flex justify-center">
            <SolarPill kw={pvKw} />
          </div>
          
          {/* Top Right - Home */}
          <div className="flex justify-center">
            <HomePill kw={loadKw} />
          </div>
          
          {/* Bottom Left - Battery */}
          <div className="flex justify-center">
            <BatteryPill soc={socPct} />
          </div>
          
          {/* Bottom Right - Grid */}
          <div className="flex justify-center">
            <GridPill imp={impKw} exp={expKw} />
          </div>
        </div>

        {/* Status row - outside hero content area */}
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[var(--muted)]">Live Data</span>
              </div>
              {updatedAt && (
                <span className="text-[var(--muted)]">
                  Updated {updatedAt.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Energy flow legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[var(--solar)] rounded" />
              <span>Solar Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[var(--purple)] rounded" />
              <span>Battery Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[var(--teal)] rounded" style={{ borderStyle: 'dashed' }} />
              <span>Grid Export</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[var(--red)] rounded" style={{ borderStyle: 'dashed' }} />
              <span>Grid Import</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
