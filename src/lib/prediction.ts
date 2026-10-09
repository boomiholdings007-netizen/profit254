export const ROUND_SECONDS = 60;
export const ENTRY_LOCK_SECONDS = 10;
export const entryOpen = (secondsLeft: number) => secondsLeft > ENTRY_LOCK_SECONDS;
export const marketAssets = [
  { name: 'btc', label: 'bitcoin', baseline: 68420, scale: 100, currency: 'usd' },
  { name: 'eth', label: 'ethereum', baseline: 3520, scale: 10, currency: 'usd' },
  { name: 'gold', label: 'gold', baseline: 2340, scale: 5, currency: 'usd' },
  { name: 'scom', label: 'safaricom', baseline: 18.5, scale: 0.1, currency: 'kes' },
  { name: 'usd/kes', label: 'currency', baseline: 129.4, scale: 0.5, currency: 'kes' },
];

// deterministic pseudo-random in [0,1) so chart and settlement always agree
const rand = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const prices: number[][] = [], velocity: number[][] = [], targets: number[][] = [];
const r2 = (n: number) => Math.round(n * 100) / 100;

/** locked target strike for a round: previous close plus an unpredictable momentum offset */
export function roundTarget(asset: number, round: number): number {
  const t = (targets[asset] ??= []);
  if (t[round] !== undefined) return t[round];
  if (round <= 0) return (t[0] = marketAssets[asset].baseline);
  const open = tickPrice(asset, round * ROUND_SECONDS);
  const v = velocity[asset][round * ROUND_SECONDS] ?? 0;
  const offset = (rand(asset * 7919 + round * 104729) - 0.5) * 0.9 + v * 2;
  return (t[round] = r2(open + offset * marketAssets[asset].scale));
}

/** price at a discrete 1-second tick: bounded random walk with momentum pulled toward the strike */
export function tickPrice(asset: number, tick: number): number {
  const p = (prices[asset] ??= [marketAssets[asset].baseline]), v = (velocity[asset] ??= [0]);
  for (let t = p.length; t <= tick; t++) {
    const target = roundTarget(asset, Math.floor((t - 1) / ROUND_SECONDS));
    const shock = (rand(asset * 15485863 + t * 32452843) - 0.5) * 0.16 * marketAssets[asset].scale;
    const nv = 0.72 * v[t - 1] + shock + (target - p[t - 1]) * 0.035;
    v[t] = nv; p[t] = r2(p[t - 1] + nv);
  }
  return p[Math.max(0, tick)];
}

export const closePrice = (asset: number, round: number) => tickPrice(asset, (round + 1) * ROUND_SECONDS);

export function odds(price: number, target: number, secondsLeft: number, scale = 1) {
  const probability = Math.max(0.2, Math.min(0.8, 0.5 + (price - target) / scale * (0.45 + (1 - secondsLeft / 60) * 0.9)));
  return { up: Number((0.94 / probability).toFixed(2)), down: Number((0.94 / (1 - probability)).toFixed(2)), probability };
}

export type Resolution = { round: number; target: number; close: number; delta: number; up: boolean; multiplier: number };
export function resolution(asset: number, round: number): Resolution {
  const target = roundTarget(asset, round), close = closePrice(asset, round), up = close > target;
  const opening = odds(tickPrice(asset, round * ROUND_SECONDS), target, 60, marketAssets[asset].scale);
  return { round, target, close, delta: r2(close - target), up, multiplier: up ? opening.up : opening.down };
}

export type DemoTrade = { id: number; asset: string; direction: 'up' | 'down'; amount: number; multiplier: number; payout: number; won: boolean; time: string };
export const money = (value: number) => value.toLocaleString('en-KE', { maximumFractionDigits: 2 });

export const quote = (asset: number, value: number) => `${marketAssets[asset].currency === 'usd' ? '$' : 'kes '}${value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
export const axisQuote = (asset: number, value: number) => marketAssets[asset].currency === 'usd' ? (value >= 10000 ? `$${(value / 1000).toFixed(2)}k` : `$${value.toFixed(2)}`) : `kes ${value.toFixed(2)}`;
