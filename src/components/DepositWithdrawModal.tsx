import { useState } from "react";
import { X, Phone, ArrowUpRight, ArrowDownLeft, Loader2, CheckCircle } from "lucide-react";

type ModalProps = {
  type: "deposit" | "withdraw";
  onClose: () => void;
  balance: number;
  onSuccess: (amount: number, type: "deposit" | "withdraw") => void;
};

const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

const DepositWithdrawModal = ({ type, onClose, balance, onSuccess }: ModalProps) => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("0712");
  const [step, setStep] = useState<"input" | "processing" | "done">("input");

  const isDeposit = type === "deposit";
  const numAmount = parseInt(amount) || 0;
  const canSubmit = numAmount >= 50 && phone.length >= 10 && (isDeposit || numAmount <= balance);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStep("processing");
    setTimeout(() => {
      setStep("done");
      onSuccess(numAmount, type);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md animate-slide-up rounded-t-2xl border-t border-border bg-card p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDeposit ? (
              <ArrowDownLeft className="h-5 w-5 text-profit" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-loss" />
            )}
            <h2 className="font-display text-lg">{isDeposit ? "Deposit" : "Withdraw"} via M-Pesa</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "input" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-body text-muted-foreground">Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 font-mono text-lg text-foreground outline-none focus:border-profit"
              />
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                      numAmount === a ? "border-profit bg-profit/10 text-profit" : "border-border text-muted-foreground"
                    }`}
                  >
                    {a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-body text-muted-foreground">M-Pesa Phone Number</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3">
                <Phone className="h-4 w-4 text-profit" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="flex-1 bg-transparent font-mono text-foreground outline-none"
                />
              </div>
            </div>

            {!isDeposit && (
              <div className="rounded-lg bg-secondary px-3 py-2 text-xs font-body text-muted-foreground">
                Available: <span className="font-mono font-semibold text-foreground">KES {balance.toLocaleString()}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full rounded-xl py-4 font-display text-sm transition-all active:scale-95 disabled:opacity-40 ${
                isDeposit
                  ? "bg-profit text-profit-foreground glow-green"
                  : "bg-loss text-loss-foreground glow-red"
              }`}
            >
              {isDeposit ? "Deposit" : "Withdraw"} KES {numAmount > 0 ? numAmount.toLocaleString() : "..."}
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-profit" />
            <p className="font-display text-sm">Sending STK push to {phone}...</p>
            <p className="text-xs font-body text-muted-foreground">Check your phone & enter your M-Pesa PIN</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="h-10 w-10 text-profit" />
            <p className="font-display text-sm">
              {isDeposit ? "Deposited" : "Withdrawn"} KES {numAmount.toLocaleString()}!
            </p>
            <button onClick={onClose} className="mt-2 rounded-lg bg-secondary px-6 py-2 text-sm font-semibold">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositWithdrawModal;
