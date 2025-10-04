/**
 * Neighborhood Map - SVG-based microgrid visualization
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { HouseNode } from './HouseNode';
import { LinkPath } from './LinkPath';
import { HomePopover } from './HomePopover';

export type HomeNodeData = {
  id: string;
  pv_kw: number;
  load_kw: number;
  soc_pct: number;
  export_kw: number;
  import_kw: number;
  sharing_kw: number;
  receiving_kw: number;
  status?: 'ok' | 'islanded' | 'outage';
  x: number;
  y: number;
};

export type Link = {
  from: string;
  to: string;
  power_kw?: number;
  directional?: 'uni' | 'bi';
};

export type NeighborhoodProps = {
  homes: HomeNodeData[];
  links?: Link[];
};

/**
 * Generate auto-layout for homes if x,y not provided
 */
function autoLayoutHomes(homes: HomeNodeData[]): HomeNodeData[] {
  const cols = 5;
  const padding = 120;
  const spacing = 180;

  return homes.map((home, idx) => {
    if (home.x && home.y) return home;
    
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    
    return {
      ...home,
      x: padding + col * spacing,
      y: padding + row * spacing,
    };
  });
}

/**
 * Compute links from homes sharing data
 */
function computeLinks(homes: HomeNodeData[]): Link[] {
  const links: Link[] = [];
  const sharers = homes.filter(h => h.sharing_kw > 0.1);
  const receivers = homes.filter(h => h.receiving_kw > 0.1);

  // Simple greedy pairing
  sharers.forEach((sharer, i) => {
    const receiver = receivers[i % receivers.length];
    if (receiver && sharer.id !== receiver.id) {
      links.push({
        from: sharer.id,
        to: receiver.id,
        power_kw: Math.min(sharer.sharing_kw, receiver.receiving_kw),
        directional: 'uni',
      });
    }
  });

  return links;
}

export function NeighborhoodMap({ homes, links }: NeighborhoodProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const layoutHomes = autoLayoutHomes(homes);
  const computedLinks = links || computeLinks(layoutHomes);

  // Map home IDs to positions
  const homePositions = new Map(
    layoutHomes.map(h => [h.id, { x: h.x, y: h.y }])
  );

  // Calculate viewBox based on home positions
  const maxX = Math.max(...layoutHomes.map(h => h.x)) + 150;
  const maxY = Math.max(...layoutHomes.map(h => h.y)) + 150;

  const selectedHome = layoutHomes.find(h => h.id === selectedNode);

  return (
    <Card className="relative overflow-hidden rounded-xl shadow-md">
      <div className="p-6">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main SVG */}
        <svg
          viewBox={`0 0 ${maxX} ${maxY}`}
          className="w-full h-auto"
          style={{ minHeight: '600px', maxHeight: '800px' }}
        >
          <defs>
            {/* Arrow marker for directional links */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
            </marker>
          </defs>

          {/* Render links first (behind nodes) */}
          <g className="links">
            {computedLinks.map((link, idx) => {
              const fromPos = homePositions.get(link.from);
              const toPos = homePositions.get(link.to);
              if (!fromPos || !toPos) return null;

              const isHighlighted = hoveredNode === link.from || hoveredNode === link.to;

              return (
                <LinkPath
                  key={`${link.from}-${link.to}-${idx}`}
                  from={fromPos}
                  to={toPos}
                  power_kw={link.power_kw || 0}
                  directional={link.directional}
                  highlighted={isHighlighted}
                />
              );
            })}
          </g>

          {/* Render nodes */}
          <g className="nodes">
            {layoutHomes.map((home) => (
              <HouseNode
                key={home.id}
                node={home}
                selected={selectedNode === home.id}
                hovered={hoveredNode === home.id}
                onHover={(id) => setHoveredNode(id)}
                onLeave={() => setHoveredNode(null)}
                onClick={(id) => setSelectedNode(id === selectedNode ? null : id)}
              />
            ))}
          </g>
        </svg>

        {/* Popover for selected home */}
        {selectedHome && (
          <HomePopover
            home={selectedHome}
            open={!!selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </Card>
  );
}
