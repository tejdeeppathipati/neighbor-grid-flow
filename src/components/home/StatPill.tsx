import React from 'react';
import { TOKENS, TYPE, formatKw, formatPercent } from './tokens';

interface StatPillProps {
  title: "Solar" | "Home" | "Battery" | "Grid" | string;
  value: string; // formatted
  tone?: "solar" | "neutral" | "battery" | "export" | "import";
  icon?: React.ReactNode;
  align?: "left" | "right";
}

export function StatPill({ 
  title, 
  value, 
  tone = "neutral", 
  icon, 
  align = "left"
}: StatPillProps) {
  const getToneStyles = () => {
    switch (tone) {
      case 'solar':
        return {
          valueColor: TOKENS.solar,
          bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'battery':
        return {
          valueColor: TOKENS.purple,
          bgColor: 'bg-purple-50 dark:bg-purple-950/20',
          borderColor: 'border-purple-200 dark:border-purple-800',
        };
      case 'export':
        return {
          valueColor: TOKENS.teal,
          bgColor: 'bg-teal-50 dark:bg-teal-950/20',
          borderColor: 'border-teal-200 dark:border-teal-800',
        };
      case 'import':
        return {
          valueColor: TOKENS.red,
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      default:
        return {
          valueColor: TOKENS.ink,
          bgColor: 'bg-gray-50 dark:bg-gray-950/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const styles = getToneStyles();

  return (
    <div 
      className={`
        rounded-2xl border bg-white shadow-sm px-3 py-2 md:px-4 md:py-3
        hover:shadow-md transition-all duration-200 hover:-translate-y-0.5
        ${styles.bgColor} ${styles.borderColor}
        ${align === 'right' ? 'text-right' : 'text-left'}
      `}
      style={{ 
        borderRadius: TOKENS.radius,
        boxShadow: TOKENS.shadow,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && (
          <div className="text-[var(--muted)]">
            {icon}
          </div>
        )}
        <h3 className={`${TYPE.label} text-[var(--muted)] uppercase tracking-wide`}>
          {title}
        </h3>
      </div>
      
      <div 
        className={`${TYPE.value} font-mono tabular-nums`}
        style={{ color: styles.valueColor }}
      >
        {value}
      </div>
    </div>
  );
}

// Convenience components for specific stat types
export function SolarPill({ kw }: { kw: number }) {
  return (
    <StatPill
      title="Solar"
      value={`${formatKw(kw)} kW`}
      tone="solar"
      icon={<div className="w-2 h-2 rounded-full bg-yellow-400" />}
    />
  );
}

export function HomePill({ kw }: { kw: number }) {
  return (
    <StatPill
      title="Home"
      value={`${formatKw(kw)} kW`}
      tone="neutral"
      icon={<div className="w-2 h-2 rounded-full bg-gray-400" />}
    />
  );
}

export function BatteryPill({ soc }: { soc: number }) {
  return (
    <StatPill
      title="Battery"
      value={`${formatPercent(soc)}%`}
      tone="battery"
      icon={<div className="w-2 h-2 rounded-full bg-purple-400" />}
    />
  );
}

export function GridPill({ imp, exp }: { imp: number; exp: number }) {
  const isExporting = exp > imp;
  const value = isExporting ? `+${formatKw(exp)}` : `↓${formatKw(imp)}`;
  
  return (
    <StatPill
      title="Grid"
      value={`${value} kW`}
      tone={isExporting ? "export" : "import"}
      icon={<div className={`w-2 h-2 rounded-full ${isExporting ? 'bg-teal-400' : 'bg-red-400'}`} />}
    />
  );
}
