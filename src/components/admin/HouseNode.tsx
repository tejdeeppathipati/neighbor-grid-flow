/**
 * HouseNode - Individual house icon with SOC ring and metrics
 */

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle } from 'lucide-react';
import type { HomeNodeData } from './NeighborhoodMap';

interface HouseNodeProps {
  node: HomeNodeData;
  selected?: boolean;
  hovered?: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}

export function HouseNode({ node, selected, hovered, onHover, onLeave, onClick }: HouseNodeProps) {
  // SOC color thresholds
  const getSocColor = (soc: number) => {
    if (soc < 20) return '#ef4444'; // red-500
    if (soc < 60) return '#f59e0b'; // amber-500
    return '#22c55e'; // green-500
  };

  // Export/Import state
  const netExport = node.export_kw - node.import_kw;
  const isExporting = netExport > 0.1;
  const isImporting = netExport < -0.1;

  // SOC ring (stroke-dasharray for partial circle)
  const socRingRadius = 28;
  const socRingCircumference = 2 * Math.PI * socRingRadius;
  const socStrokeDasharray = `${(node.soc_pct / 100) * socRingCircumference} ${socRingCircumference}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <g
            transform={`translate(${node.x}, ${node.y})`}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={onLeave}
            onClick={() => onClick(node.id)}
            className="cursor-pointer transition-transform"
            style={{
              transform: hovered || selected ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: 'center',
            }}
          >
            {/* Glow effect on hover/select */}
            {(hovered || selected) && (
              <circle
                cx="0"
                cy="0"
                r="45"
                fill={selected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.05)'}
                className="animate-pulse"
              />
            )}

            {/* SOC Ring */}
            <circle
              cx="0"
              cy="0"
              r={socRingRadius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="0"
              cy="0"
              r={socRingRadius}
              fill="none"
              stroke={getSocColor(node.soc_pct)}
              strokeWidth="4"
              strokeDasharray={socStrokeDasharray}
              strokeLinecap="round"
              transform="rotate(-90)"
              className="transition-all duration-700"
            />

            {/* House icon (simple SVG) */}
            <g transform="scale(0.8)">
              <path
                d="M0,-20 L-15,0 L-10,0 L-10,15 L10,15 L10,0 L15,0 Z"
                fill={isExporting ? '#22c55e' : isImporting ? '#ef4444' : '#94a3b8'}
                stroke={hovered || selected ? '#3b82f6' : '#64748b'}
                strokeWidth={hovered || selected ? '2' : '1.5'}
                className="transition-all"
              />
              {/* Roof */}
              <path
                d="M-18,-20 L0,-35 L18,-20"
                fill={node.pv_kw > 0 ? '#fbbf24' : '#cbd5e1'}
                stroke={hovered || selected ? '#3b82f6' : '#64748b'}
                strokeWidth={hovered || selected ? '2' : '1.5'}
                className="transition-all"
              />
              {/* Solar panel indicator */}
              {node.pv_kw > 0 && (
                <g>
                  <rect x="-12" y="-30" width="8" height="6" fill="#fbbf24" opacity="0.8" />
                  <rect x="4" y="-30" width="8" height="6" fill="#fbbf24" opacity="0.8" />
                </g>
              )}
            </g>

            {/* Status badge */}
            {node.status === 'islanded' && (
              <g transform="translate(20, -20)">
                <circle cx="0" cy="0" r="8" fill="#fbbf24" />
                <g transform="scale(0.4) translate(-12, -12)">
                  <Zap className="text-white" />
                </g>
              </g>
            )}
            {node.status === 'outage' && (
              <g transform="translate(20, -20)">
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <g transform="scale(0.4) translate(-12, -12)">
                  <AlertTriangle className="text-white" />
                </g>
              </g>
            )}

            {/* Label below house */}
            <text
              x="0"
              y="50"
              textAnchor="middle"
              className="font-mono font-bold"
              fontSize="12"
              fill="#1f2937"
            >
              {node.id}
            </text>
            <text
              x="0"
              y="65"
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {node.pv_kw.toFixed(1)}kW • {node.load_kw.toFixed(1)}kW
            </text>
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-bold text-sm border-b pb-1">{node.id}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">PV:</span>
                <span className="ml-1 font-semibold text-yellow-600">{node.pv_kw.toFixed(1)} kW</span>
              </div>
              <div>
                <span className="text-muted-foreground">Load:</span>
                <span className="ml-1 font-semibold">{node.load_kw.toFixed(1)} kW</span>
              </div>
              <div>
                <span className="text-muted-foreground">SOC:</span>
                <span className="ml-1 font-semibold" style={{ color: getSocColor(node.soc_pct) }}>
                  {node.soc_pct}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {isExporting ? 'Export:' : isImporting ? 'Import:' : 'Grid:'}
                </span>
                <span className={`ml-1 font-semibold ${isExporting ? 'text-green-600' : isImporting ? 'text-red-600' : ''}`}>
                  {Math.abs(netExport).toFixed(1)} kW
                </span>
              </div>
            </div>
            {(node.sharing_kw > 0 || node.receiving_kw > 0) && (
              <div className="pt-1 border-t text-xs">
                {node.sharing_kw > 0 && (
                  <div className="text-green-600">
                    ↑ Sharing: {node.sharing_kw.toFixed(1)} kW
                  </div>
                )}
                {node.receiving_kw > 0 && (
                  <div className="text-blue-600">
                    ↓ Receiving: {node.receiving_kw.toFixed(1)} kW
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
