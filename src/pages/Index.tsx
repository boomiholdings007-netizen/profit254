import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown, Clock, Wallet, Menu, Users, Zap, TrendingUp, BarChart3, LineChart } from "lucide-react";
import DepositWithdrawModal from "@/components/DepositWithdrawModal";
import MenuPanel from "@/components/MenuPanel";

const generatePriceData = (base: number, count: number) => {
  const data: number[] = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    price += (Math.random() - 0.42) * (base * 0.002);
    data.push(Math.round(price * 100) / 100);
  }
  return data;
};

const ASSETS = [
  { name: "BTC", symbol: "₿", base: 8810019 },
  { name: "ETH", symbol: "Ξ", base: 452300 },
  { name: "USD", symbol: "$", base: 129.5 },
  { name: "GOLD", symbol: "Au", base: 302400 },
  { name: "SCOM", symbol: "S", base: 192.5 },
];

const TIMEFRAMES = [
  { label: "30s", seconds: 8 },
  { label: "1m", seconds: 10 },
  { label: "5m", seconds: 12 },
];

const AMOUNTS = [50, 100, 250, 500, 1000, 5000];

const feedNames = ["Brian K.", "Amina W.", "Kevin O.", "Faith M.", "Hassan A.", "Mercy N.", "James T.", "Lucy W.", "David L.", "Jane W."];

type Trade = {
  id: number;
  asset: string;
  direction: "up" | "down";
  amount: number;
  payout: number;
  won: boolean;
  time: string;
};

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [prices, setPrices] = useState(() => generatePriceData(ASSETS[0].base, 60));
  const [amount, setAmount] = useState(100);
  const [timeframeIdx, setTimeframeIdx] = useState(0);
  const [activeTrade, setActiveTrade] = useState<{ direction: "up" | "down"; countdown: number; startPrice: number } | null>(null);
  const [result, setResult] = useState<{ won: boolean; payout: number } | null>(null);
  const [balance, setBalance] = useState(10000);
  const [isDemo, setIsDemo] = useState(true);
  const [communityUp, setCommunityUp] = useState(57);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [modalType, setModalType] = useState<"deposit" | "withdraw" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [changes] = useState(() => ASSETS.map(() => parseFloat(((Math.random() - 0.5) * 2).toFixed(2))));

  const [feed, setFeed] = useState([
    { id: 1, name: "David L.", won: false, amount: 250 },
    { id: 2, name: "Jane W.", won: true, amount: 1850 },
  ]);

  const currentPrice = prices[prices.length - 1];

  // Live price
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() - 0.42) * (ASSETS[selectedAsset].base * 0.001);
        return [...prev.slice(1), Math.round(next * 100) / 100];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  useEffect(() => {
    setPrices(generatePriceData(ASSETS[selectedAsset].base, 60));
  }, [selectedAsset]);

  // Community sentiment
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityUp((prev) => Math.max(30, Math.min(70, prev + Math.floor(Math.random() * 7) - 3)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const won = Math.random() > 0.4;
      const amt = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
      setFeed((prev) => [
        { id: Date.now(), name: feedNames[Math.floor(Math.random() * feedNames.length)], won, amount: won ? Math.round(amt * 1.85) : amt },
        prev[0],
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Trade countdown
  useEffect(() => {
    if (!activeTrade) return;
    if (activeTrade.countdown <= 0) {
      const won = Math.random() > 0.45;
      const payout = won ? Math.round(amount * 1.85) : 0;
      setResult({ won, payout });
      if (won) setBalance((b) => b + payout);
      const pnlChange = won ? payout - amount : -amount;
      setTotalPnl((p) => p + pnlChange);
      const trade: Trade = {
        id: Date.now(),
        asset: ASSETS[selectedAsset].name,
        direction: activeTrade.direction,
        amount,
        payout,
        won,
        time: new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setTradeHistory((prev) => [trade, ...prev]);
      setActiveTrade(null);
      setFeed((prev) => [{ id: Date.now(), name: "You", won, amount: won ? payout : amount }, prev[0]]);
      return;
    }
    const timer = setTimeout(() => {
      setActiveTrade((t) => (t ? { ...t, countdown: t.countdown - 1 } : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTrade, amount, selectedAsset]);

  const placeTrade = useCallback(
    (direction: "up" | "down") => {
      if (balance < amount) return;
      setResult(null);
      setBalance((b) => b - amount);
      setActiveTrade({ direction, countdown: TIMEFRAMES[timeframeIdx].seconds, startPrice: currentPrice });
    },
    [amount, balance, timeframeIdx, currentPrice]
  );

  const handleWalletAction = (amt: number, type: "deposit" | "withdraw") => {
    if (type === "deposit") setBalance((b) => b + amt);
    else setBalance((b) => b - amt);
    setModalType(null);
  };

  // Chart
  const chartWidth = 700;
  const chartHeight = 200;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const points = prices.map((p, i) => `${(i / (prices.length - 1)) * chartWidth},${chartHeight - ((p - min) / range) * (chartHeight - 10) - 5}`).join(" ");
  const lastPoint = points.split(" ").pop();
  const barWidth = chartWidth / prices.length * 0.7;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-profit" />
          <span className="font-display text-base">
            Profit<span className="text-gradient-brand">254</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo/Real toggle */}
          <button
            onClick={() => setIsDemo(!isDemo)}
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-colors ${
              isDemo ? "bg-profit/20 text-profit" : "bg-loss/20 text-loss"
            }`}
          >
            {isDemo ? "DEMO" : "REAL"}
          </button>
          <div className="flex items-center gap-1 text-xs font-mono font-semibold">
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">{balance.toLocaleString()}</span>
          </div>
          <button onClick={() => setModalType("deposit")} className="rounded-md bg-profit/20 px-2 py-1 text-[10px] font-bold text-profit">
            +
          </button>
          <button onClick={() => setModalType("withdraw")} className="rounded-md bg-loss/20 px-2 py-1 text-[10px] font-bold text-loss">
            −
          </button>
          <button onClick={() => setMenuOpen(true)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Asset tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-border scrollbar-none">
        {ASSETS.map((asset, i) => (
          <button
            key={asset.name}
            onClick={() => { setSelectedAsset(i); setResult(null); setActiveTrade(null); }}
            className={`flex min-w-[68px] flex-col items-center px-3 py-2 text-xs transition-colors ${
              i === selectedAsset ? "bg-secondary border-b-2 border-profit" : "text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-1">
              <span className={`text-xs font-bold ${i === selectedAsset ? "text-foreground" : ""}`}>{asset.symbol}</span>
              <span className={`font-semibold ${i === selectedAsset ? "text-foreground" : ""}`}>{asset.name}</span>
            </div>
            <span className={`text-[10px] font-mono ${changes[i] >= 0 ? "text-profit" : "text-loss"}`}>
              {changes[i] >= 0 ? "+" : ""}{changes[i]}%
            </span>
          </button>
        ))}
      </div>

      {/* Price + Chart */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 pt-3">
          <div>
            <div className="font-mono text-2xl font-bold text-profit">
              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] font-semibold font-body text-muted-foreground">KES · LIVE</div>
          </div>
          {/* Chart toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-0.5">
            <button
              onClick={() => setChartType("line")}
              className={`rounded-md p-1.5 transition-colors ${chartType === "line" ? "bg-profit/20 text-profit" : "text-muted-foreground"}`}
            >
              <LineChart className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`rounded-md p-1.5 transition-colors ${chartType === "bar" ? "bg-profit/20 text-profit" : "text-muted-foreground"}`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="px-2 py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="none" style={{ height: 150 }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145 80% 42%)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(145 80% 42%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((r) => (
              <line key={r} x1="0" y1={chartHeight * r} x2={chartWidth} y2={chartHeight * r} stroke="hsl(0 0% 20%)" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}

            {chartType === "line" ? (
              <>
                <polygon points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`} fill="url(#cg)" />
                <polyline points={points} fill="none" stroke="hsl(145 80% 42%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {lastPoint && (
                  <>
                    <circle cx={lastPoint.split(",")[0]} cy={lastPoint.split(",")[1]} r="5" fill="hsl(145 80% 42%)" />
                    <circle cx={lastPoint.split(",")[0]} cy={lastPoint.split(",")[1]} r="8" fill="hsl(145 80% 42%)" opacity="0.3">
                      <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </>
            ) : (
              <>
                {prices.map((p, i) => {
                  const prev = i > 0 ? prices[i - 1] : p;
                  const barH = ((p - min) / range) * (chartHeight - 10);
                  const x = (i / prices.length) * chartWidth;
                  const isBarUp = p >= prev;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={chartHeight - barH - 5}
                      width={barWidth}
                      height={barH}
                      fill={isBarUp ? "hsl(145 80% 42%)" : "hsl(0 72% 51%)"}
                      opacity={i === prices.length - 1 ? 1 : 0.6}
                      rx="1"
                    />
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Live feed */}
      <div className="border-b border-border">
        {feed.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-border/50 px-4 py-2 last:border-0">
            <div className="flex items-center gap-2">
              <Zap className={`h-3.5 w-3.5 ${item.won ? "text-profit" : "text-loss"}`} />
              <span className="text-sm font-body">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted-foreground"> {item.won ? "won" : "lost"}</span>
              </span>
            </div>
            <span className={`font-mono text-sm font-bold ${item.won ? "text-profit" : "text-loss"}`}>
              {item.won ? "+" : "-"}KES {item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`px-4 py-3 text-center font-semibold text-sm ${result.won ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>
          {result.won ? `🎉 You won KES ${result.payout.toLocaleString()}!` : `Trade lost -KES ${amount.toLocaleString()}`}
        </div>
      )}

      {/* Active trade */}
      {activeTrade && (
        <div className="bg-secondary px-4 py-3 text-center">
          <div className="text-xs font-body text-muted-foreground">Trade active</div>
          <div className={`font-mono text-xl font-bold ${activeTrade.direction === "up" ? "text-profit" : "text-loss"}`}>
            {activeTrade.direction === "up" ? "📈" : "📉"} {activeTrade.countdown}s
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex-1 px-4 py-3 space-y-3">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-body text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Duration
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIMEFRAMES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTimeframeIdx(i)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition-all ${
                  i === timeframeIdx ? "border-profit bg-profit/10 text-profit" : "border-border text-muted-foreground"
                }`}
              >
                <Clock className="h-3 w-3" /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-body text-muted-foreground">
            💰 Bet Amount
          </div>
          <div className="grid grid-cols-3 gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-xl border py-2 text-sm font-semibold transition-all ${
                  a === amount ? "border-profit bg-profit/10 text-profit" : "border-border text-muted-foreground"
                }`}
              >
                {a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Community sentiment */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-body text-muted-foreground">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Community</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse" /> LIVE</span>
          </div>
          <div className="flex h-6 w-full overflow-hidden rounded-md">
            <div className="flex items-center justify-start bg-profit px-2 text-[10px] font-bold text-profit-foreground transition-all duration-500" style={{ width: `${communityUp}%` }}>
              {communityUp}% ↑
            </div>
            <div className="flex items-center justify-end bg-loss px-2 text-[10px] font-bold text-loss-foreground transition-all duration-500" style={{ width: `${100 - communityUp}%` }}>
              ↓ {100 - communityUp}%
            </div>
          </div>
        </div>
      </div>

      {/* Sticky UP/DOWN buttons */}
      <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-border bg-background p-3">
        <button
          disabled={!!activeTrade || balance < amount}
          onClick={() => placeTrade("up")}
          className="flex items-center justify-center gap-2 rounded-xl bg-profit py-3.5 text-sm font-bold text-profit-foreground transition-all active:scale-95 disabled:opacity-40"
        >
          <ArrowUp className="h-5 w-5" />
          <div className="text-left">
            <div>📈 UP</div>
            <div className="text-[10px] font-medium opacity-80">×1.85</div>
          </div>
        </button>
        <button
          disabled={!!activeTrade || balance < amount}
          onClick={() => placeTrade("down")}
          className="flex items-center justify-center gap-2 rounded-xl bg-loss py-3.5 text-sm font-bold text-loss-foreground transition-all active:scale-95 disabled:opacity-40"
        >
          <ArrowDown className="h-5 w-5" />
          <div className="text-left">
            <div>📉 DOWN</div>
            <div className="text-[10px] font-medium opacity-80">×1.85</div>
          </div>
        </button>
      </div>

      {/* Modals */}
      {modalType && (
        <DepositWithdrawModal type={modalType} onClose={() => setModalType(null)} balance={balance} onSuccess={handleWalletAction} />
      )}
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} trades={tradeHistory} balance={balance} totalPnl={totalPnl} />
    </div>
  );
};

export default Index;
