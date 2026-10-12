export const ROUND_SECONDS = 60;
export const ENTRY_LOCK_SECONDS = 10;
export const entryOpen = (secondsLeft: number) => secondsLeft > ENTRY_LOCK_SECONDS;
export const marketAssets = [
  { name: 'btc', label: 'bitcoin', baseline: 68420, scale: 100, currency: 'usd', category: 'crypto', symbol: 'btcusdt', ticks: 1 },
  { name: 'eth', label: 'ethereum', baseline: 3520, scale: 10, currency: 'usd', category: 'crypto', symbol: 'ethusdt', ticks: 1 },
  { name: 'gold', label: 'gold (xau/usd)', baseline: 2340, scale: 5, currency: 'usd', category: 'forex & local', symbol: '', ticks: 1 },
  { name: 'scom', label: 'safaricom', baseline: 18.5, scale: 0.1, currency: 'kes', category: 'forex & local', symbol: '', ticks: 1 },
  { name: 'usd/kes', label: 'currency', baseline: 129.4, scale: 0.5, currency: 'kes', category: 'forex & local', symbol: '', ticks: 1 },
  { name: 'sol', label: 'solana (sol/usdt)', baseline: 150, scale: 1, currency: 'usd', category: 'crypto', symbol: 'solusdt', ticks: 1 },
  { name: 'bnb', label: 'binance coin (bnb/usdt)', baseline: 600, scale: 3, currency: 'usd', category: 'crypto', symbol: 'bnbusdt', ticks: 1 },
  { name: 'xrp', label: 'ripple (xrp/usdt)', baseline: .6, scale: .01, currency: 'usd', category: 'crypto', symbol: 'xrpusdt', ticks: 1 },
  { name: 'vol 75', label: 'vol 75 index', baseline: 10000, scale: 85, currency: 'usd', category: 'synthetics', symbol: '', ticks: 4 },
  { name: 'turbo 100', label: 'turbo 100 index', baseline: 10000, scale: 260, currency: 'usd', category: 'synthetics', symbol: '', ticks: 10 },
  { name: 'jump 25', label: 'jump 25 index', baseline: 10000, scale: 55, currency: 'usd', category: 'synthetics', symbol: '', ticks: 2 },
];

// deterministic pseudo-random in [0,1) so chart and settlement always agree
const rand = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const prices: number[][] = [], velocity: number[][] = [], targets: number[][] = [];
const syntheticPrices: number[][] = [];
export function syntheticPrice(asset: number, seconds: number): number {
 const a=marketAssets[asset], hz=a.ticks, end=Math.max(0,Math.floor(seconds*hz));
 const history=syntheticPrices[asset]??= [a.baseline];
 const dt=1/hz, sigma=a.scale/Math.sqrt(60)*.65;
 for(let n=history.length;n<=end;n++){
  const u=Math.max(1e-9,rand(asset*7919+n*17)), v=rand(asset*104729+n*31);
  const gaussian=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
  const trend=asset===9?Math.sin(n/(hz*3))*a.scale/150: a.scale/1200;
  const jump=rand(asset*65537+n*47)<(asset===10?.075:.025)*dt?(rand(n*101+asset)-.5)*a.scale*.65:0;
  history.push(Math.max(.01,history[n-1]+trend*dt+sigma*Math.sqrt(dt)*gaussian+jump));
 }
 return Math.round(history[end]*100)/100;
}
const r2 = (n: number) => Math.round(n * 100) / 100;

/** locked target strike for a round: previous close plus an unpredictable momentum offset */
export function roundTarget(asset: number, round: number): number {
  const t = (targets[asset] ??= []);
  if (t[round] !== undefined) return t[round];
  if (round <= 0) return (t[0] = marketAssets[asset].baseline);
  if (marketAssets[asset].category==='synthetics') return (t[round]=syntheticPrice(asset,round*ROUND_SECONDS));
  const open = tickPrice(asset, round * ROUND_SECONDS);
  const v = velocity[asset][round * ROUND_SECONDS] ?? 0;
  const offset = (rand(asset * 7919 + round * 104729) - 0.5) * 0.9 + v / marketAssets[asset].scale * 2;
  return (t[round] = r2(open + offset * marketAssets[asset].scale));
}

/** price at a discrete 1-second tick: bounded random walk with momentum pulled toward the strike */
export function tickPrice(asset: number, tick: number): number {
   if(marketAssets[asset].category==='synthetics') return syntheticPrice(asset,tick);
   tick=Math.max(0,Math.floor(tick));
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

export type DemoTrade = { id: number; asset: string; direction: 'up' | 'down'; amount: number; multiplier: number; payout: number; won: boolean; time: string; timestamp?: string; entry?: number; target?: number; close?: number; balance?: number; round?: number; status?: 'open' | 'closed' | 'void' };
export const money = (value: number) => value.toLocaleString('en-KE', { maximumFractionDigits: 2 });

// Display-only reference rate, not a live foreign exchange quote.
export const DISPLAY_USD_KES = 129.4;
export type Currency = 'kes' | 'usd' | 'eur';
export const DISPLAY_RATES: Record<Currency, number> = { kes: 1, usd: DISPLAY_USD_KES, eur: 141.2 };
export const currencyPrefix = (currency: Currency) => currency === 'kes' ? 'kes ' : currency === 'usd' ? '$' : '€';
export const fromKes = (value:number, currency:Currency) => value / DISPLAY_RATES[currency];
export const toKes = (value:number, currency:Currency) => Math.round(value * DISPLAY_RATES[currency] * 100) / 100;
export const displayMoney = (value:number, currency:Currency='kes') => currencyPrefix(currency) + fromKes(value,currency).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export function quoteValue(asset:number,value:number,currency?:Currency){const native=marketAssets[asset].currency as Currency;return value*DISPLAY_RATES[native]/DISPLAY_RATES[currency??native];}
export const quote = (asset: number, value: number, currency?:Currency) => currencyPrefix(currency??marketAssets[asset].currency as Currency)+quoteValue(asset,value,currency).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
export const axisQuote = (asset: number, value: number, currency?:Currency) => {const v=quoteValue(asset,value,currency);return currencyPrefix(currency??marketAssets[asset].currency as Currency)+(v>=10000?`${(v/1000).toFixed(2)}k`:v.toFixed(2));};

export function overtimeDecision(close:number|undefined,target:number,rolled:boolean):'rollover'|'refund'|'settle' { return close===undefined?'refund':close===target?(rolled?'refund':'rollover'):'settle'; }
