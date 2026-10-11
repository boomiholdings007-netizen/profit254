import { describe, it, expect } from 'vitest';
import { csvCell, statementCsv } from '@/lib/statements';
import type { DemoTrade } from '@/lib/prediction';
describe('account statement exports', () => {
  const trade: DemoTrade = {id:1,asset:'btc',direction:'up',amount:100,multiplier:1.88,payout:188,won:true,time:'12:00',entry:68000,target:68000,close:68010,balance:1288,status:'closed'};
  it('escapes quotes without replaceAll and guards spreadsheet formulas', () => {
    expect(csvCell('say "up"')).toBe('"say ""up"""');
    expect(csvCell('=1+1')).toBe('"\'=1+1"');
  });
  it('exports position prices and KES accounting', () => {
    expect(statementCsv([trade])).toContain('"68000","68000","68010","100","188","88","1288"');
  });
  it('leaves open payout and net empty, never records a pending loss', () => {
    expect(statementCsv([{...trade,status:'open',payout:0}])).toContain('"100","","","1288"');
  });
});