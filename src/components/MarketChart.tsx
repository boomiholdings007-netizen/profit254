import { tickPrice, roundTarget, ROUND_SECONDS, marketAssets, quote, axisQuote } from '@/lib/prediction';

type Props = { asset: number; tick: number; origin: number };
const W = 610, TOP = 16, BOT = 250, BEFORE = 96, AFTER = 24, SPAN = BEFORE + AFTER;
const stamp = (ms: number) => new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export default function MarketChart({ asset, tick, origin }: Props) {
  const start = tick - BEFORE, x = (t: number) => (t - start) / SPAN * W;
  const pts: { t: number; p: number }[] = [];
  for (let t = Math.max(0, start); t <= tick; t++) pts.push({ t, p: tickPrice(asset, t) });
  if (!pts.length) pts.push({ t: Math.max(0, tick), p: tickPrice(asset, Math.max(0, tick)) });
  const current = Math.floor(tick / ROUND_SECONDS), firstRound = Math.max(0, Math.floor(start / ROUND_SECONDS));
  const rounds = Array.from({ length: current - firstRound + 1 }, (_, i) => firstRound + i).map(r => ({ r, target: roundTarget(asset, r) }));
  const vals = [...pts.map(p => p.p), ...rounds.map(r => r.target)];
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const span = Math.max(hi - lo, marketAssets[asset].scale * 0.4), pad = span * 0.15; lo -= pad; hi += pad;
  if (hi - lo < marketAssets[asset].scale * 0.4 * 1.3) { const mid = (hi + lo) / 2; lo = mid - marketAssets[asset].scale * 0.26; hi = mid + marketAssets[asset].scale * 0.26; }
  const y = (p: number) => TOP + (hi - p) / (hi - lo) * (BOT - TOP);
  let path = `M ${x(pts[0].t)} ${y(pts[0].p)}`;
  for (let i = 1; i < pts.length; i++) path += ` H ${x(pts[i].t)} V ${y(pts[i].p)}`;
  const last = pts[pts.length - 1], target = roundTarget(asset, current), above = last.p >= target;
  const xTicks: number[] = []; for (let t = Math.ceil(start / 15) * 15; t <= start + SPAN; t += 30) xTicks.push(t);
  return <div className={`market-chart ${above ? 'is-up' : 'is-down'}`}>
    <svg viewBox="0 0 740 290" role="img" aria-label="live index chart, time on the bottom and asset currency on the right">
      <defs><linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.16"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient><clipPath id="plot"><rect x="0" y="0" width={W} height={BOT}/></clipPath></defs>
      {[0.1, 0.3, 0.5, 0.7, 0.9].map(f => { const v = hi - (hi - lo) * f; return <g key={f}><line x1="0" x2={W} y1={y(v)} y2={y(v)} className="chart-grid"/><text x="738" y={y(v) + 4} textAnchor="end" className="chart-label">{axisQuote(asset, v)}</text></g>; })}
      <g clipPath="url(#plot)">
        {rounds.map(({ r, target: tg }) => { const x1 = Math.max(0, x(r * ROUND_SECONDS)), x2 = r === current ? W : x((r + 1) * ROUND_SECONDS); return <g key={r}>
          {r * ROUND_SECONDS > start && <line x1={x(r * ROUND_SECONDS)} x2={x(r * ROUND_SECONDS)} y1={TOP} y2={BOT} className="round-flag"/>}
          <line x1={x1} x2={x2} y1={y(tg)} y2={y(tg)} className={r === current ? 'target-line' : 'target-line past-target'}/>
        </g>; })}
        <path d={`${path} H ${x(last.t)} V ${BOT} H ${x(pts[0].t)} Z`} fill="url(#price-fill)"/>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"/>
        <line x1={x(last.t)} x2={W} y1={y(last.p)} y2={y(last.p)} className="current-guide"/>
        <circle cx={x(last.t)} cy={y(last.p)} r="10" fill="currentColor" opacity="0.15" className="price-pulse"/>
        <circle cx={x(last.t)} cy={y(last.p)} r="4.5" fill="currentColor"/>
      </g>
      <line x1="0" x2={W} y1={BOT} y2={BOT} className="chart-grid"/>
      <rect x="478" y={y(target) - 27} width="132" height="22" rx="4" className="target-tag"/><text x="544" y={y(target) - 12} textAnchor="middle" className="target-text">target {quote(asset, target)}</text>
      {xTicks.map(t => <text key={t} x={x(t)} y="276" textAnchor="middle" className="chart-label">{stamp(origin + t * 1000)}</text>)}
    </svg>
  </div>;
}
