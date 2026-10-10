export const DEPOSIT_FEE_KES = 3;
export const WITHDRAWAL_TIERS = [[49,0],[100,2],[500,6],[1000,9],[1500,15],[2500,22],[3500,25],[5000,35],[10000,45],[20000,55],[70000,65],[150000,75]] as const;
// User-provided reference schedule. Verify with Palpluss before enabling payments.
export function withdrawalFee(amount:number):number {
 if (!Number.isFinite(amount) || amount < 10 || amount > 150000 || !Number.isInteger(amount)) throw new Error('cashout must be whole kes 10–150,000');
 return WITHDRAWAL_TIERS.find(([limit])=>amount<=limit)?.[1] ?? 75;
}
export function cashierQuote(amount:number,type:'deposit'|'withdraw') {
 if(!Number.isFinite(amount)||!Number.isInteger(amount)||amount< (type==='deposit'?100:10)||amount>150000)throw new Error('invalid amount');
 const fee=type==='deposit'?DEPOSIT_FEE_KES:withdrawalFee(amount);
 return {amount,fee,total:amount+fee};
}