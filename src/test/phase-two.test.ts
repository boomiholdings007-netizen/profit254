import { describe, it, expect } from 'vitest';
import { combinedStreamUrl, parseQuote } from '@/hooks/use-market-feed';
import { marketAssets, syntheticPrice, tickPrice, closePrice, overtimeDecision } from '@/lib/prediction';
import { cashierQuote, withdrawalFee } from '@/lib/palpluss-fees';
describe('phase two integrity',()=>{
 it('uses valid combined streams for all five crypto assets',()=>{expect(combinedStreamUrl).toContain('/stream?streams=');expect(combinedStreamUrl.split('@ticker').length-1).toBe(5);expect(parseQuote(JSON.stringify({data:{s:'SOLUSDT',c:'150.23',E:12345}}))).toEqual({asset:5,sample:{price:150.23,time:12345}});expect(parseQuote('{')).toBeNull();expect(parseQuote(JSON.stringify({data:{s:'BTCUSDT',c:'bad',E:1}}))).toBeNull();});
 it('uses deterministic subsecond quotes and identical closing prices',()=>{for(const i of [8,9,10]){const n=syntheticPrice(i,59.5);expect(syntheticPrice(i,59.5)).toBe(n);expect(tickPrice(i,59.5)).toBe(n);expect(closePrice(i,0)).toBe(syntheticPrice(i,60));expect(Number.isFinite(n)).toBe(true);expect(marketAssets[i].ticks).toBeGreaterThan(1);}expect(syntheticPrice(9,1)).not.toBe(syntheticPrice(9,1.1));});
 it('rolls once, refunds repeated ties and stale closes',()=>{expect(overtimeDecision(100,100,false)).toBe('rollover');expect(overtimeDecision(100,100,true)).toBe('refund');expect(overtimeDecision(undefined,100,false)).toBe('refund');expect(overtimeDecision(101,100,true)).toBe('settle');});
 it('does not invent standard fees and debits payout plus fee',()=>{expect(cashierQuote(250,'deposit')).toEqual({amount:250,fee:3,total:253});expect(withdrawalFee(49)).toBe(6);expect(()=>withdrawalFee(50)).toThrow(/verification/);expect(withdrawalFee(150000)).toBe(200);expect(withdrawalFee(250000)).toBe(5000);expect(cashierQuote(20,'withdraw').total).toBe(26);});
});
