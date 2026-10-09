import { useState } from 'react';
import { Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSheet from './AppSheet';
import { money } from '@/lib/prediction';
type Props = { initialPhone?: string; type: 'deposit' | 'withdraw'; onClose: () => void; balance: number; onSuccess: (amount: number, type: 'deposit' | 'withdraw') => void };
export default function DepositWithdrawModal({ type, onClose, balance, onSuccess, initialPhone = '' }: Props) {
 const [amount,setAmount] = useState('100'); const [phone,setPhone] = useState(initialPhone); const [done,setDone] = useState(false);
 const value = Number(amount); const valid = Number.isFinite(value) && value >= 100 && value <= 10000 && /^(?:0[17]\d{8}|254[17]\d{8})$/.test(phone.replace(/[\s+]/g,'')) && (type === 'deposit' || value <= balance);
 return <AppSheet open onClose={onClose} title={`${type} via m-pesa`} description="practice wallet · no real money is transferred">
 {done ? <div className="success-state"><CheckCircle2 size={48} className="text-profit"/><h3>practice {type} complete</h3><p>kes {money(value)}</p><Button variant="tactile" onClick={onClose}>done</Button></div> : <div className="space-y-5"><div className="flex justify-between text-sm text-muted-foreground"><span>available balance</span><span className="text-foreground">kes {money(balance)}</span></div><label className="field-label" htmlFor="wallet-amount">amount in kes</label><input id="wallet-amount" type="number" min="100" max="10000" className="app-input" value={amount} onChange={e=>setAmount(e.target.value)}/><div className="grid grid-cols-3 gap-2">{[100,500,1000,2500,5000,10000].map(a=><Button variant="tactile" className={a===value?'selected-chip':''} key={a} onClick={()=>setAmount(String(a))}>{money(a)}</Button>)}</div><label className="field-label" htmlFor="wallet-phone">m-pesa phone number</label><div className="relative"><Phone className="input-icon text-safaricom" size={18}/><input id="wallet-phone" type="tel" className="app-input pl-11" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xx xxx xxx"/></div>{type==='withdraw'&&value>balance&&<p className="text-sm text-loss">amount exceeds your available balance</p>}<Button variant="up" className="h-14 w-full" disabled={!valid} onClick={()=>{onSuccess(value,type);setDone(true);}}>{type} kes {money(value)}</Button><p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={15}/> demo only · real m-pesa payments are not connected</p></div>}
 </AppSheet>;
}
