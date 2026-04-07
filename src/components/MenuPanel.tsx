import { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, MessageCircle, BarChart3, DollarSign } from "lucide-react";

type Trade = {
  id: number;
  asset: string;
  direction: "up" | "down";
  amount: number;
  payout: number;
  won: boolean;
  time: string;
};

type ChatMsg = {
  id: number;
  name: string;
  msg: string;
  time: string;
};

const CHAT_NAMES = ["Brian K.", "Amina W.", "Kevin O.", "Faith M.", "Hassan A.", "Mercy N.", "James T.", "Lucy W."];
const CHAT_MSGS = [
  "Just won 5k on BTC! 🔥",
  "ETH going crazy rn",
  "Who else is trading GOLD?",
  "This app is legit 💯",
  "3 wins in a row lets go",
  "Withdrew to M-Pesa instantly",
  "USD pair looking bullish",
  "Started with 500 now I'm at 4k",
  "Anyone on SCOM?",
  "Night trading hits different 🌙",
  "M-Pesa deposit went through in 2 seconds",
  "Lost one but bouncing back",
  "Chart pattern looking good on BTC",
  "New to this... any tips?",
  "Just try UP on BTC trust me 😂",
];

type MenuPanelProps = {
  open: boolean;
  onClose: () => void;
  trades: Trade[];
  balance: number;
  totalPnl: number;
};

const MenuPanel = ({ open, onClose, trades, balance, totalPnl }: MenuPanelProps) => {
  const [tab, setTab] = useState<"history" | "chat" | "pnl">("history");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(() => {
    const now = new Date();
    return [
      { id: 1, name: "Kevin O.", msg: "BTC going UP for sure 📈", time: formatTime(now) },
      { id: 2, name: "Faith M.", msg: "Just withdrew 3k to M-Pesa", time: formatTime(now) },
      { id: 3, name: "Hassan A.", msg: "Who else is making money tonight? 🔥", time: formatTime(now) },
    ];
  });

  function formatTime(d: Date) {
    return d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      const name = CHAT_NAMES[Math.floor(Math.random() * CHAT_NAMES.length)];
      const msg = CHAT_MSGS[Math.floor(Math.random() * CHAT_MSGS.length)];
      setChatMessages((prev) => [
        { id: Date.now(), name, msg, time: formatTime(new Date()) },
        ...prev.slice(0, 19),
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  const wins = trades.filter((t) => t.won).length;
  const losses = trades.filter((t) => !t.won).length;
  const winRate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-background/60 backdrop-blur-sm" />
      <div
        className="flex h-full w-[85%] max-w-sm flex-col bg-card animate-slide-in-right border-l border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-base">Dashboard</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { key: "history" as const, icon: BarChart3, label: "History" },
            { key: "pnl" as const, icon: DollarSign, label: "P&L" },
            { key: "chat" as const, icon: MessageCircle, label: "Live Chat" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                tab === t.key ? "border-b-2 border-profit text-foreground" : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {tab === "history" && (
            <div className="p-4">
              {trades.length === 0 ? (
                <p className="py-12 text-center text-sm font-body text-muted-foreground">No trades yet. Place your first trade!</p>
              ) : (
                <div className="space-y-2">
                  {trades.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {t.direction === "up" ? (
                          <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-loss" />
                        )}
                        <div>
                          <div className="text-xs font-semibold">{t.asset} · {t.direction.toUpperCase()}</div>
                          <div className="text-[10px] font-body text-muted-foreground">{t.time}</div>
                        </div>
                      </div>
                      <div className={`font-mono text-sm font-bold ${t.won ? "text-profit" : "text-loss"}`}>
                        {t.won ? "+" : "-"}KES {(t.won ? t.payout : t.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "pnl" && (
            <div className="p-4 space-y-4">
              <div className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
                <div className="text-xs font-body text-muted-foreground mb-1">Total P&L</div>
                <div className={`font-display text-3xl ${totalPnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {totalPnl >= 0 ? "+" : ""}KES {totalPnl.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <div className="text-[10px] font-body text-muted-foreground">Trades</div>
                  <div className="font-mono text-lg font-bold">{trades.length}</div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <div className="text-[10px] font-body text-muted-foreground">Win Rate</div>
                  <div className="font-mono text-lg font-bold text-profit">{winRate}%</div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
                  <div className="text-[10px] font-body text-muted-foreground">Balance</div>
                  <div className="font-mono text-sm font-bold">{balance.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-profit/30 bg-profit/5 p-3 text-center">
                  <div className="text-[10px] font-body text-profit">Wins</div>
                  <div className="font-mono text-xl font-bold text-profit">{wins}</div>
                </div>
                <div className="rounded-xl border border-loss/30 bg-loss/5 p-3 text-center">
                  <div className="text-[10px] font-body text-loss">Losses</div>
                  <div className="font-mono text-xl font-bold text-loss">{losses}</div>
                </div>
              </div>
            </div>
          )}

          {tab === "chat" && (
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
                <span className="text-xs font-body text-muted-foreground">{Math.floor(Math.random() * 200 + 300)} traders online</span>
              </div>
              <div className="space-y-2.5">
                {chatMessages.map((m) => (
                  <div key={m.id} className="rounded-xl bg-secondary/50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{m.name}</span>
                      <span className="text-[10px] font-body text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm font-body text-muted-foreground">{m.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPanel;
