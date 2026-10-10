import { Coins, ArrowLeftRight } from 'lucide-react';
export default function MarketIcon({asset}:{asset:number}) {
 if(asset===4)return <ArrowLeftRight aria-hidden/>;
 if(asset===2)return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="m7 10 18 0 4 13H3L7 10Z"/><path d="m7 10 5 7h17M12 17l-3 6M12 17l13-7"/></svg>;
 if(asset===3)return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 21C8 11 18 6 26 8c-1 8-9 14-16 14l11-11-14 10Z"/></svg>;
 if(asset===1)return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden><path d="m16 2 9 15-9-4-9 4 9-15Z" opacity=".8"/><path d="m7 18 9 12 9-12-9 5-9-5Z"/><path d="m7 17 9-4 9 4-9 5-9-5Z" opacity=".5"/></svg>;
 if(asset===0)return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="16" cy="16" r="14"/><g transform="rotate(15 16 16)"><path d="M11 8v16M9 9h10a4 4 0 0 1 0 8H11m7 0a4 4 0 0 1 0 7H9M14 5v4m4-4v4m-4 15v3m4-3v3"/></g></svg>;
 return <Coins aria-hidden/>;
}
