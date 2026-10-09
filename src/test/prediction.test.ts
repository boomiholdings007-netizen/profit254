import { describe, it, expect } from 'vitest';
import { tickPrice, roundTarget, closePrice, marketAssets, odds, entryOpen, quote, resolution } from '@/lib/prediction';
describe('shared simulated market engine',()=>{
 it('starts at realistic asset baselines',()=>marketAssets.forEach((a,i)=>expect(tickPrice(i,0)).toBe(a.baseline)));
 it('is deterministic and resolves at displayed closing tick',()=>marketAssets.forEach((a,i)=>{for(let r=0;r<8;r++){const target=roundTarget(i,r);const close=tickPrice(i,(r+1)*60);expect(closePrice(i,r)).toBe(close);expect(resolution(i,r).close).toBe(close);expect(roundTarget(i,r)).toBe(target);expect(Number.isFinite(close)).toBe(true);}}));
 it('locks exactly the final 10 seconds',()=>{expect(entryOpen(11)).toBe(true);expect(entryOpen(10)).toBe(false);expect(entryOpen(1)).toBe(false);});
 it('normalizes odds to price movement scale',()=>{expect(odds(101,100,30)).toEqual(odds(68520,68420,30,100));});
 it('formats native and converted currency',()=>{expect(quote(0,68420)).toBe('$68,420.00');expect(quote(3,18.5)).toBe('kes 18.50');expect(quote(4,129.4,'usd')).toBe('$1.00');});
});
