import { indexPrice } from '@/lib/prediction';

type Props = { elapsed: number; asset: number; round: number; startTime: number };
const X = 610;
const y = (price: number) => 20 + ((102 - price) / 2.5) * 230;
const timeLabel = (timestamp: number) => new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
export default function MarketChart({ elapsed, asset, round, startTime }: Props) {
  const samples = Array.from({ length: Math.floor(elapsed * 2) + 1 }, (_, i) => ({ x: i / 2 / 60 * X, y: y(indexPrice(i / 2, asset, round)) }));
  samples.push({ x: elapsed / 60 * X, y: y(indexPrice(elapsed, asset, round)) });
  let path = `M ${samples[0].x} ${samples[0].y}`;
  for (let i = 1; i < samples.length; i++) {
    const p0 = samples[Math.max(0, i - 2)], p1 = samples[i - 1], p2 = samples[i], p3 = samples[Math.min(samples.length - 1, i + 1)];
    path += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  const last = samples[samples.length - 1];
  const above = indexPrice(elapsed, asset, round) >= 100;
  return <div className={`market-chart ${above ? 'is-up' : 'is-down'}`}>
    <svg viewBox="0 0 700 290" role="img" aria-label="simulated index price chart, time on the bottom and index points on the right">
      <defs><linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.14"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
      {[102,101.5,101,100.5,100,99.5].map(p => <g key={p}><line x1="0" x2={X} y1={y(p)} y2={y(p)} className="chart-grid"/><text x="695" y={y(p)+4} textAnchor="end" className="chart-label">{p.toFixed(2)}</text></g>)}
      <line x1="0" x2={X} y1={y(100)} y2={y(100)} className="target-line"/>
      <path d={`${path} L ${last.x} 252 L 0 252 Z`} fill="url(#price-fill)"/>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
      <line x1={last.x} x2={last.x} y1={last.y} y2="252" className="current-guide"/>
      <circle cx={last.x} cy={last.y} r="10" fill="currentColor" opacity="0.15" className="price-pulse"/>
      <circle cx={last.x} cy={last.y} r="4.5" fill="currentColor"/>
      <rect x="604" y={y(100)-28} width="91" height="21" rx="4" className="target-tag"/><text x="650" y={y(100)-14} textAnchor="middle" className="target-text">target ▾</text>
      {[0,15,30,45,60].map(t => <text key={t} x={t/60*X} y="282" textAnchor={t === 0 ? 'start' : t === 60 ? 'end' : 'middle'} className="chart-label">{timeLabel(startTime+t*1000)}:{String(t).padStart(2,'0')}</text>)}
    </svg>
  </div>;
}
