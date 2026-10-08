import { useEffect, useRef, useState } from 'react';

type Props = { value: number; format?: (n: number) => string; className?: string };
export default function OdometerNumber({ value, format = n => n.toFixed(2), className = '' }: Props) {
  const prev = useRef(value), [dir, setDir] = useState<'up' | 'down' | null>(null);
  useEffect(() => {
    if (value === prev.current) return;
    setDir(value > prev.current ? 'up' : 'down'); prev.current = value;
    const t = setTimeout(() => setDir(null), 450); return () => clearTimeout(t);
  }, [value]);
  const text = format(value);
  return <span className={`odometer ${dir ? `od-${dir}` : ''} ${className}`} aria-label={text}>
    {text.split('').map((c, i) => {
      const key = text.length - i;
      return /\d/.test(c)
        ? <span key={key} className="od-digit" aria-hidden><span className="od-reel" style={{ transform: `translateY(-${Number(c) * 10}%)` }}>{'0123456789'.split('').map(d => <span key={d}>{d}</span>)}</span></span>
        : <span key={key} aria-hidden>{c}</span>;
    })}
  </span>;
}
