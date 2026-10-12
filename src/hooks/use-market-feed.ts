import { useEffect, useState } from 'react';
import { ROUND_SECONDS, marketAssets, roundTarget, tickPrice, resolution, odds } from '@/lib/prediction';
export type Sample = { time:number; price:number };
type Feed = { latest?:Sample; samples:Sample[]; targets:Map<number,number>; connected:boolean };
const feeds:Feed[]=marketAssets.map(()=>({samples:[],targets:new Map(),connected:false}));
export const combinedStreamUrl='wss://stream.binance.com:9443/stream?streams='+marketAssets.filter(a=>a.symbol).map(a=>a.symbol+'@ticker').join('/');
export function parseQuote(raw:string):{asset:number;sample:Sample}|null {
 try { const envelope=JSON.parse(raw), data=envelope.data??envelope;
 const asset=marketAssets.findIndex(a=>a.symbol===String(data.s).toLowerCase()),price=Number(data.c),time=Number(data.E);
 return asset>=0&&Number.isFinite(price)&&price>0&&Number.isFinite(time)?{asset,sample:{price,time}}:null;
 } catch {return null;}
}
const listeners=new Set<()=>void>();let stop:(()=>void)|undefined;
const notify=()=>listeners.forEach(fn=>fn());
function start(origin:number){let disposed=false,socket:WebSocket|undefined,retry:ReturnType<typeof setTimeout>|undefined,delay=1000;
 const connect=()=>{if(disposed)return;socket=new WebSocket(combinedStreamUrl);
 socket.onmessage=e=>{const q=parseQuote(e.data);if(!q)return;const feed=feeds[q.asset],{time}=q.sample;
 if(Math.abs(Date.now()-time)>3000||(feed.latest&&time<=feed.latest.time))return;
 const round=Math.floor((time-origin)/60000);if(round<0)return;
 if(!feed.targets.has(round))feed.targets.set(round,q.sample.price);
 feed.latest=q.sample;feed.samples.push(q.sample);feed.connected=true;delay=1000;notify();};
 socket.onerror=()=>socket?.close();socket.onclose=()=>{feeds.forEach(f=>f.connected=false);notify();if(!disposed){retry=setTimeout(connect,delay);delay=Math.min(30000,delay*2);}};};connect();
 return()=>{disposed=true;if(retry)clearTimeout(retry);socket?.close();};
}
function sampleAt(asset:number,time:number){const samples=feeds[asset].samples;let lo=0,hi=samples.length;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(samples[mid].time<=time)lo=mid+1;else hi=mid;}return samples[lo-1];}
export function useMarketFeed(origin:number,asset:number,tick:number){const [,refresh]=useState(0);
 useEffect(()=>{const fn=()=>refresh(n=>n+1);listeners.add(fn);if(!stop)stop=start(origin);return()=>{listeners.delete(fn);if(!listeners.size){stop?.();stop=undefined;}};},[origin]);
 const feed=feeds[asset],crypto=!!marketAssets[asset].symbol,live=crypto&&!!feed.latest;
 const paused=crypto&&(!feed.connected||!feed.latest||Date.now()-feed.latest.time>3000);
 const priceAt=(index:number,t:number)=>marketAssets[index].symbol?(sampleAt(index,origin+t*1000)?.price??marketAssets[index].baseline):tickPrice(index,t);
 const targetAt=(index:number,round:number)=>marketAssets[index].symbol?(feeds[index].targets.get(round)??feeds[index].latest?.price??marketAssets[index].baseline):roundTarget(index,round);
 const resultAt=(index:number,round:number)=>{if(!marketAssets[index].symbol)return resolution(index,round);const deadline=origin+(round+1)*ROUND_SECONDS*1000,sample=sampleAt(index,deadline),target=feeds[index].targets.get(round);if(!sample||deadline-sample.time>3000||target===undefined)return null;
 const close=sample.price,up=close>target,opening=odds(target,target,60,marketAssets[index].scale);return {round,target,close,delta:Math.round((close-target)*100)/100,up,multiplier:up?opening.up:opening.down};};
 return {live,paused,price:crypto?(feed.latest?.price??marketAssets[asset].baseline):tickPrice(asset,tick),target:targetAt(asset,Math.floor(tick/60)),priceAt,targetAt,resultAt};
}
