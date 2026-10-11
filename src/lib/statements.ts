import type { DemoTrade } from './prediction';
export const csvCell = (value:unknown) => { let text=String(value??''); if(/^[=+@\-\t\r]/.test(text))text="'"+text; return '"'+text.replace(/"/g,'""')+'"'; };
export function statementCsv(trades:DemoTrade[]) {
 return ['timestamp,market,direction,status,entry,target,close,stake_kes,payout_kes,net_kes,balance_kes', ...trades.map(t=>[t.timestamp??t.time,t.asset,t.direction,t.status??'closed',t.entry,t.target,t.close,t.amount,t.status==='open'?null:t.payout,t.status==='open'?null:t.payout-t.amount,t.balance].map(csvCell).join(','))].join('\r\n');
}