/**
 * LinkPath - Renders connection between two homes
 */

interface LinkPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  power_kw: number;
  directional?: 'uni' | 'bi';
  highlighted?: boolean;
}

export function LinkPath({ from, to, power_kw, directional, highlighted }: LinkPathProps) {
  // Compute stroke width based on power (1.5px - 4px)
  const minWidth = 1.5;
  const maxWidth = 4;
  const strokeWidth = Math.min(maxWidth, minWidth + (power_kw / 2) * (maxWidth - minWidth));

  // Color based on power magnitude
  const getColor = () => {
    if (power_kw > 1) return '#22c55e'; // green-500 (high export)
    if (power_kw > 0.3) return '#f59e0b'; // amber-500 (medium)
    return '#94a3b8'; // slate-400 (low/neutral)
  };

  // Create curved path for better aesthetics
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Control point for quadratic curve (slight arc)
  const controlOffset = dist * 0.15;
  const controlX = (from.x + to.x) / 2 - dy / dist * controlOffset;
  const controlY = (from.y + to.y) / 2 + dx / dist * controlOffset;

  const pathD = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;

  return (
    <g className="link-path">
      {/* Glow effect when highlighted */}
      {highlighted && (
        <path
          d={pathD}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth + 4}
          opacity="0.2"
          className="animate-pulse"
        />
      )}
      
      {/* Main path */}
      <path
        d={pathD}
        fill="none"
        stroke={getColor()}
        strokeWidth={strokeWidth}
        opacity={highlighted ? 1 : 0.6}
        strokeDasharray={directional === 'uni' ? '5 3' : undefined}
        markerEnd={directional === 'uni' ? 'url(#arrowhead)' : undefined}
        className="transition-all duration-300"
      >
        {/* Pulse animation for active links */}
        {power_kw > 0.5 && (
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Power label (optional, only for significant flows) */}
      {power_kw > 0.8 && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 5}
          textAnchor="middle"
          fontSize="9"
          fill={getColor()}
          fontWeight="600"
          className="pointer-events-none"
        >
          {power_kw.toFixed(1)}kW
        </text>
      )}
    </g>
  );
}
