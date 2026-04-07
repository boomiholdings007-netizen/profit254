import { useState } from "react";
import { X, Copy, Gift, Users, CheckCircle, Share2 } from "lucide-react";

type ReferralPanelProps = {
  open: boolean;
  onClose: () => void;
};

const MOCK_REFERRALS = [
  { name: "Brian K.", earned: 250, date: "Today" },
  { name: "Amina W.", earned: 500, date: "Yesterday" },
  { name: "Kevin O.", earned: 100, date: "2 days ago" },
];

const ReferralPanel = ({ open, onClose }: ReferralPanelProps) => {
  const [copied, setCopied] = useState(false);
  const referralCode = "PROFIT" + Math.floor(Math.random() * 9000 + 1000);
  const referralLink = `https://profit254.app/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Profit254 🚀",
          text: `I'm making money on Profit254! Join with my link and get KES 200 bonus on your first trade.`,
          url: referralLink,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md animate-slide-up rounded-t-3xl border-t border-border bg-card p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />

        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-profit/20">
              <Gift className="h-5 w-5 text-profit" />
            </div>
            <div>
              <h2 className="font-display text-lg">Invite & Earn</h2>
              <p className="text-xs font-body text-muted-foreground">Get KES 200 per friend!</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reward banner */}
        <div className="mb-4 overflow-hidden rounded-2xl border-2 border-dashed border-profit/30 bg-profit/5 p-4 text-center">
          <div className="mb-1 text-3xl">🎁</div>
          <p className="font-display text-sm text-profit">KES 200 Bonus</p>
          <p className="mt-1 text-xs font-body text-muted-foreground">
            For every friend who places their first trade
          </p>
        </div>

        {/* Referral link */}
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-secondary px-3 py-3">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-xl bg-profit/20 px-3 py-1.5 text-xs font-bold text-profit transition-all active:scale-95"
          >
            {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-profit py-4 font-display text-sm text-profit-foreground transition-all active:scale-95"
        >
          <Share2 className="h-4 w-4" />
          Share with Friends
        </button>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-border bg-secondary/50 p-3 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <div className="font-mono text-xl font-bold">3</div>
            <div className="text-[10px] font-body text-muted-foreground">Friends Invited</div>
          </div>
          <div className="rounded-2xl border border-profit/30 bg-profit/5 p-3 text-center">
            <Gift className="mx-auto mb-1 h-4 w-4 text-profit" />
            <div className="font-mono text-xl font-bold text-profit">850</div>
            <div className="text-[10px] font-body text-muted-foreground">KES Earned</div>
          </div>
        </div>

        {/* Recent referrals */}
        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Recent Referrals</h3>
          <div className="space-y-1.5">
            {MOCK_REFERRALS.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-profit/20 text-xs font-bold text-profit">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{r.name}</div>
                    <div className="text-[10px] font-body text-muted-foreground">{r.date}</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-profit">+KES {r.earned}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPanel;
