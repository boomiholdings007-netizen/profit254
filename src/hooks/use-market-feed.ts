import { useEffect, useState } from 'react';
import { ROUND_SECONDS, marketAssets, roundTarget, tickPrice, resolution, odds } from '@/lib/prediction';

type Sample = { time: number; price: number };
type Feed = { latest?: Sample; samples: Sample[]; targets: Map<number, number>; connected: boolean; started: boolean };
const feeds: Feed[] = [0, 1].map(() => ({ samples: [], targets: new Map(), connected: false, started: false }));
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());
let stopStreams: (() => void) | undefined;

// Transport and mutable exchange history stay outside the pure simulated engine.
function startStreams(origin: number) {
  let disposed = false;
  const cleanups = feeds.map((feed, asset) => {
    let socket: WebSocket | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let delay = 1000;
    const connect = () => {
      if (disposed) return;
      socket = new WebSocket(`wss://stream.binance.com:9443/ws/${asset === 0 ? 'btc' : 'eth'}usdt@ticker`);
      socket.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          const price = Number(data.c), time = Number(data.E);
          if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(time) || Math.abs(Date.now() - time) > 3000 || (feed.latest && time <= feed.latest.time)) return;
          const round = Math.floor((time - origin) / (ROUND_SECONDS * 1000));
          if (round < 0) return;
          if (!feed.targets.has(round)) feed.targets.set(round, price);
          feed.latest = { time, price };
          feed.samples.push(feed.latest);
          feed.connected = true;
          feed.started = true;
          delay = 1000;
          notify();
        } catch { /* Ignore malformed exchange messages, never settle with them. */ }
      };
      socket.onerror = () => socket?.close();
      socket.onclose = () => {
        feed.connected = false;
        notify();
        if (!disposed) { retry = setTimeout(connect, delay); delay = Math.min(delay * 2, 30000); }
      };
    };
    connect();
    return () => { if (retry) clearTimeout(retry); socket?.close(); };
  });
  return () => { disposed = true; cleanups.forEach(fn => fn()); };
}

function sampleAt(asset: number, time: number): Sample | undefined {
  const samples = feeds[asset]?.samples;
  if (!samples) return;
  // Upper-bound search: settlement only uses a quote at or before the deadline.
  let lo = 0, hi = samples.length;
  while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (samples[mid].time <= time) lo = mid + 1; else hi = mid; }
  return samples[lo - 1];
}

export function useMarketFeed(origin: number, asset: number, tick: number) {
  const [, refresh] = useState(0);
  useEffect(() => {
    const listener = () => refresh(n => n + 1);
    listeners.add(listener);
    if (!stopStreams) stopStreams = startStreams(origin);
    return () => { listeners.delete(listener); if (!listeners.size) { stopStreams?.(); stopStreams = undefined; } };
  }, [origin]);
  const feed = feeds[asset];
  const live = !!feed?.started;
  const paused = asset < 2 && (!feed?.connected || !feed.latest || Date.now() - feed.latest.time > 3000);
  const priceAt = (index: number, t: number) => {
    const f = feeds[index];
    if (!f?.started) return tickPrice(index, t);
    return sampleAt(index, origin + (t + 1) * 1000 - 1)?.price ?? f.samples[0]?.price ?? marketAssets[index].baseline;
  };
  const targetAt = (index: number, round: number) => feeds[index]?.started
    ? feeds[index].targets.get(round) ?? feeds[index].latest?.price ?? marketAssets[index].baseline
    : roundTarget(index, round);
  const resultAt = (index: number, round: number) => {
    if (!feeds[index]?.started) return resolution(index, round);
    const deadline = origin + (round + 1) * ROUND_SECONDS * 1000;
    const sample = sampleAt(index, deadline);
    const target = feeds[index].targets.get(round);
    if (!sample || deadline - sample.time > 3000 || target === undefined) return null;
    const close = sample.price, up = close > target;
    const opening = odds(target, target, 60, marketAssets[index].scale);
    return { round, target, close, delta: Math.round((close - target) * 100) / 100, up, multiplier: up ? opening.up : opening.down };
  };
  const round = Math.floor(tick / ROUND_SECONDS);
  return { live, paused, price: live ? feed.latest?.price ?? priceAt(asset, tick) : tickPrice(asset, tick), target: targetAt(asset, round), priceAt, targetAt, resultAt };
}