import { CheckCircle2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

const names = ["Brian K.", "Amina W.", "Kevin O.", "Faith M.", "Hassan A.", "Mercy N.", "James T.", "Lucy W."];
const amounts = [850, 1200, 3400, 500, 2100, 4750, 920, 1650, 7800, 2300];

const LiveFeed = () => {
  const [feed, setFeed] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      name: names[i % names.length],
      amount: amounts[i % amounts.length],
      action: i % 2 === 0 ? "won" : "withdrew",
      time: `${i + 1}m ago`,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const newItem = {
          id: Date.now(),
          name: names[Math.floor(Math.random() * names.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          action: Math.random() > 0.4 ? "won" : "withdrew",
          time: "Just now",
        };
        return [newItem, ...prev.slice(0, 3)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
            Live Activity
          </div>
          <div className="space-y-2">
            {feed.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    item.action === "won" ? "bg-profit/10" : "bg-primary/10"
                  }`}>
                    {item.action === "won" ? (
                      <Trophy className="h-4 w-4 text-profit" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}{item.action === "won" ? "won" : "withdrew"}
                    </span>
                    <span className="text-sm font-bold text-profit"> KES {item.amount.toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
