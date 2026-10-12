export const DEPOSIT_FEE_KES=3;
// Unspecified standard pricing is intentionally blocked until verified.
export function withdrawalFee(amount:number):number {
 if(!Number.isInteger(amount)||amount<1)throw new Error('enter a whole kes amount');
 if(amount<=49)return 6;
 if(amount<150000)throw new Error('standard palpluss fee requires verification');
 if(amount<250000)return 200;
 return Math.ceil(amount*.02*100)/100;
}
export function cashierQuote(amount:number,type:'deposit'|'withdraw') {
 if(!Number.isFinite(amount)||!Number.isInteger(amount)||amount<(type==='deposit'?250:1)||(type==='deposit'&&amount>150000))throw new Error('invalid amount');
 const fee=type==='deposit'?DEPOSIT_FEE_KES:withdrawalFee(amount);
 return {amount,fee,total:amount+fee};
}
