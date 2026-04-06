import { useState } from "react";
import { Smartphone, ArrowDownToLine, ArrowUpFromLine, CheckCircle2 } from "lucide-react";

const WalletSection = () => {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [phone, setPhone] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="wallet" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          M-Pesa <span className="text-gradient-brand">Wallet</span>
        </h2>
        <p className="mb-10 text-center text-muted-foreground">Instant deposits & withdrawals via M-Pesa</p>

        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card">
          {/* Tabs */}
          <div className="grid grid-cols-2">
            <button
              onClick={() => { setTab("deposit"); setSubmitted(false); }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === "deposit" ? "bg-profit/10 text-profit border-b-2 border-profit" : "text-muted-foreground border-b border-border"
              }`}
            >
              <ArrowDownToLine className="h-4 w-4" /> Deposit
            </button>
            <button
              onClick={() => { setTab("withdraw"); setSubmitted(false); }}
              className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                tab === "withdraw" ? "bg-loss/10 text-loss border-b-2 border-loss" : "text-muted-foreground border-b border-border"
              }`}
            >
              <ArrowUpFromLine className="h-4 w-4" /> Withdraw
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-profit" />
                <p className="text-lg font-semibold">
                  {tab === "deposit" ? "STK Push sent!" : "Withdrawal initiated!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tab === "deposit"
                    ? "Check your phone and enter your M-Pesa PIN"
                    : "You'll receive the funds in your M-Pesa shortly"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Smartphone className="h-4 w-4" /> M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="500"
                    min={50}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Min: KES 50 · Max: KES 150,000</p>
                </div>

                <button
                  type="submit"
                  className={`w-full rounded-xl py-4 text-base font-bold transition-all hover:scale-[1.01] ${
                    tab === "deposit"
                      ? "bg-profit text-profit-foreground glow-green"
                      : "bg-loss text-loss-foreground glow-red"
                  }`}
                >
                  {tab === "deposit" ? "Deposit via M-Pesa" : "Withdraw to M-Pesa"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default WalletSection;
