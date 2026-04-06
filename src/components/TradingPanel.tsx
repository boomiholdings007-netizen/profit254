import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown, Clock, DollarSign } from "lucide-react";

const generatePriceData = (base: number, count: number) => {
  const data: number[] = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    price += (Math.random() - 0.48) * 2;
    data.push(Math.round(price * 100) / 100);
  }
  return data;
};

const ASSETS = [
  { name: "BTC/USD", base: 67432.5 },
  { name: "EUR/USD", base: 1.0842 },
  { name: "GOLD", base: 2341.8 },
  { name: "AAPL", base: 189.25 },
];

const TIMEFRAMES = ["30s", "1m", "5m"];
const AMOUNTS = [100, 250, 500, 1000];

const TradingPanel = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [prices, setPrices] = useState(() => generatePriceData(ASSETS[0].base, 50));
  const [amount, setAmount] = useState(250);
  const [timeframe, setTimeframe] = useState("1m");
  const [activeTrade, setActiveTrade] = useState<{ direction: "up" | "down"; countdown: number } | null>(null);
  const [result, setResult] = useState<{ won: boolean; payout: number } | null>(null);

  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  const priceChange = currentPrice - prevPrice;
  const isUp = priceChange >= 0;

  // Live price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() - 0.48) * (ASSETS[selectedAsset].base * 0.001);
        return [...prev.slice(1), Math.round(next * 100) / 100];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  useEffect(() => {
    setPrices(generatePriceData(ASSETS[selectedAsset].base, 50));
  }, [selectedAsset]);

  // Trade countdown
  useEffect(() => {
    if (!activeTrade) return;
    if (activeTrade.countdown <= 0) {
      const won = Math.random() > 0.45;
      setResult({ won, payout: won ? amount * 1.85 : 0 });
      setActiveTrade(null);
      return;
    }
    const timer = setTimeout(() => {
      setActiveTrade((t) => t ? { ...t, countdown: t.countdown - 1 } : null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTrade, amount]);

  const placeTrade = useCallback((direction: "up" | "down") => {
    setResult(null);
    const seconds = timeframe === "30s" ? 30 : timeframe === "1m" ? 60 : 300;
    setActiveTrade({ direction, countdown: Math.min(seconds, 10) }); // Demo: cap at 10s
  }, [timeframe]);

  // Mini chart SVG
  const chartWidth = 600;
  const chartHeight = 120;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const points = prices
    .map((p, i) => `${(i / (prices.length - 1)) * chartWidth},${chartHeight - ((p - min) / range) * chartHeight}`)
    .join(" ");

  return (
    <section id="trade" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Trade <span className="text-gradient-brand">Now</span>
        </h2>
        <p className="mb-10 text-center text-muted-foreground">Pick an asset, choose your amount, predict the direction</p>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card">
          {/* Asset selector */}
          <div className="flex gap-0 border-b border-border overflow-x-auto">
            {ASSETS.map((asset, i) => (
              <button
                key={asset.name}
                onClick={() => { setSelectedAsset(i); setResult(null); setActiveTrade(null); }}
                className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-semibold transition-colors ${
                  i === selectedAsset ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {asset.name}
              </button>
            ))}
          </div>

          {/* Price display */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <div className="font-mono text-3xl font-bold">{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-profit" : "text-loss"}`}>
                {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(priceChange).toFixed(2)} ({((priceChange / prevPrice) * 100).toFixed(3)}%)
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="font-mono">H: {max.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="font-mono">L: {min.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="border-b border-border px-4 py-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "hsl(145 80% 42%)" : "hsl(0 72% 51%)"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isUp ? "hsl(145 80% 42%)" : "hsl(0 72% 51%)"} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                fill="url(#chartGrad)"
              />
              <polyline
                points={points}
                fill="none"
                stroke={isUp ? "hsl(145 80% 42%)" : "hsl(0 72% 51%)"}
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Trading controls */}
          <div className="p-6">
            {/* Amount */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" /> Amount (KES)
              </label>
              <div className="flex gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                      a === amount
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe */}
            <div className="mb-6">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" /> Duration
              </label>
              <div className="flex gap-2">
                {TIMEFRAMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-all ${
                      t === timeframe
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade result */}
            {result && (
              <div className={`mb-4 rounded-xl p-4 text-center font-semibold ${
                result.won ? "bg-profit/10 text-profit glow-green" : "bg-loss/10 text-loss glow-red"
              }`}>
                {result.won
                  ? `🎉 You won KES ${result.payout.toLocaleString()}!`
                  : "Trade expired out of the money. Try again!"}
              </div>
            )}

            {/* Active trade */}
            {activeTrade && (
              <div className="mb-4 rounded-xl border border-border bg-secondary p-4 text-center">
                <div className="text-sm text-muted-foreground">Trade active — waiting...</div>
                <div className={`mt-1 font-mono text-2xl font-bold ${activeTrade.direction === "up" ? "text-profit" : "text-loss"}`}>
                  {activeTrade.direction === "up" ? "📈" : "📉"} {activeTrade.countdown}s
                </div>
              </div>
            )}

            {/* UP / DOWN buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={!!activeTrade}
                onClick={() => placeTrade("up")}
                className="glow-green flex items-center justify-center gap-2 rounded-xl bg-profit py-5 text-lg font-bold text-profit-foreground transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                <ArrowUp className="h-6 w-6" /> UP
              </button>
              <button
                disabled={!!activeTrade}
                onClick={() => placeTrade("down")}
                className="glow-red flex items-center justify-center gap-2 rounded-xl bg-loss py-5 text-lg font-bold text-loss-foreground transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                <ArrowDown className="h-6 w-6" /> DOWN
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Potential payout: <span className="font-semibold text-profit">85%</span> · KES {Math.round(amount * 1.85).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingPanel;
