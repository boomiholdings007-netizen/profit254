export const ROUND_SECONDS = 60;
export const marketAssets = [
  { name: 'btc', label: 'bitcoin', symbol: '₿' },
  { name: 'eth', label: 'ethereum', symbol: 'Ξ' },
  { name: 'gold', label: 'gold index', symbol: '✦' },
  { name: 'scom', label: 'safaricom', symbol: 's' },
  { name: 'usd/kes', label: 'currency index', symbol: '$' },
];
export function indexPrice(seconds: number, asset = 0, round = 0) {
  const phase = asset * 1.3 + round * 0.83;
  const wave = (t: number) => 0.55 * Math.sin(t / 9 + phase) + 0.24 * Math.sin(t / 3.8 + phase / 2) + 0.13 * Math.sin(t / 1.9 + phase);
  return 100 + wave(seconds) - wave(0) + 0.34 * Math.sin(seconds / 26);
}
export function odds(price: number, secondsLeft: number) {
  const probability = Math.max(0.18, Math.min(0.82, 0.5 + (price - 100) * (0.19 + (1 - secondsLeft / 60) * 0.2)));
  return { up: Number((0.94 / probability).toFixed(2)), down: Number((0.94 / (1 - probability)).toFixed(2)), probability };
}
export type DemoTrade = { id: number; asset: string; direction: 'up' | 'down'; amount: number; multiplier: number; payout: number; won: boolean; time: string };
export const money = (value: number) => value.toLocaleString('en-KE', { maximumFractionDigits: 2 });
