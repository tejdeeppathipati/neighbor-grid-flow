/**
 * Number formatting utilities - whole numbers only (no decimals)
 */

export function formatKw(value: number): string {
  const rounded = Math.round(value);
  return rounded === 0 && value !== 0 && Math.abs(value) < 0.5 ? '0' : rounded.toString();
}

export function formatKwh(value: number): string {
  const rounded = Math.round(value);
  return rounded === 0 && value !== 0 && Math.abs(value) < 0.5 ? '0' : rounded.toString();
}

export function formatPercent(value: number): string {
  return Math.round(value).toString();
}

export function formatCredits(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return '0';
  return rounded > 0 ? `+${rounded}` : rounded.toString();
}

export function formatNumber(value: number): number {
  return Math.round(value);
}
