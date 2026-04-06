const TickerBar = () => {
  const items = [
    { name: "BTC/USD", price: "67,432.50", change: "+2.4%", up: true },
    { name: "ETH/USD", price: "3,521.80", change: "+1.8%", up: true },
    { name: "GOLD", price: "2,341.20", change: "-0.3%", up: false },
    { name: "EUR/USD", price: "1.0842", change: "+0.1%", up: true },
    { name: "AAPL", price: "189.25", change: "-1.2%", up: false },
    { name: "TSLA", price: "248.50", change: "+3.1%", up: true },
  ];

  const duplicated = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-border bg-card/50 py-2">
      <div className="animate-ticker flex w-max gap-8">
        {duplicated.map((item, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap text-xs font-mono">
            <span className="font-semibold text-foreground">{item.name}</span>
            <span className="text-muted-foreground">{item.price}</span>
            <span className={item.up ? "text-profit" : "text-loss"}>{item.change}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
