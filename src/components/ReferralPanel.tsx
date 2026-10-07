import { useState } from 'react';
import { Copy, Gift, MessageCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSheet from './AppSheet';
export default function ReferralPanel({open,onClose}:{open:boolean;onClose:()=>void}){
 const [copied,setCopied]=useState(false); const [error,setError]=useState('');
 const link = `${window.location.origin}/?ref=p254demo`;
 async function copy(){try{await navigator.clipboard.writeText(link);setCopied(true);}catch{setError('copy unavailable · select the link below');}}
 return <AppSheet open={open} onClose={onClose} title="invite & earn" description="a little better, together"><div className="referral-reward"><Gift size={50}/><span className="text-xs text-muted-foreground">your referral reward</span><h3>kes 200</h3><p>when your friend places their first trade</p><span className="demo-note">preview offer · rewards are not active yet</span></div><label className="field-label" htmlFor="referral-link">your invite link</label><div className="flex gap-2 mt-2"><input id="referral-link" readOnly value={link} className="app-input min-w-0 text-xs"/><Button variant="tactile" size="icon" className="h-12 w-12 shrink-0" onClick={copy} aria-label="copy referral link">{copied?<Check/>:<Copy/>}</Button></div>{copied&&<p className="text-sm text-profit mt-2">link copied</p>}{error&&<p className="text-sm text-loss">{error}</p>}<Button variant="up" className="w-full h-14 mt-5" asChild><a href={`https://wa.me/?text=${encodeURIComponent('try profit254 with me: '+link)}`} target="_blank" rel="noopener noreferrer"><MessageCircle/>share on whatsapp</a></Button><div className="flex justify-around border-t border-border mt-6 pt-5 text-center"><div><strong>0</strong><p className="text-xs text-muted-foreground mt-1">friends invited</p></div><div><strong>kes 0</strong><p className="text-xs text-muted-foreground mt-1">rewards earned</p></div></div></AppSheet>;
}
