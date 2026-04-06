import { TrendingUp, ArrowDown, Users, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  const scrollToTrade = () => {
    document.getElementById("trade")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: "linear-gradient(hsl(145 80% 42% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(145 80% 42% / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="animate-slide-up mx-auto max-w-2xl">
          {/* Live stats bar */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-profit animate-pulse" />
              <span className="font-semibold text-profit">2,847</span> traders online
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span>KES <span className="font-semibold text-foreground">14.2M</span> paid out today</span>
            <span className="hidden sm:inline text-border">|</span>
            <span><span className="font-semibold text-profit">85%</span> payout</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Make Money in{" "}
            <span className="text-gradient-brand">60 Seconds</span>
          </h1>

          <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground md:text-lg">
            Will the price go up or down? Get it right and earn{" "}
            <span className="font-bold text-profit">85% profit</span> instantly to your M-Pesa.
          </p>

          <button
            onClick={scrollToTrade}
            className="glow-green rounded-xl bg-profit px-10 py-5 text-lg font-bold text-profit-foreground transition-all hover:scale-105 active:scale-95"
          >
            Trade Now — It's Free to Start
          </button>

          {/* Trust signals */}
          <div className="mt-10 grid grid-cols-3 gap-3 mx-auto max-w-sm">
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/50 p-3">
              <Shield className="h-5 w-5 text-profit" />
              <span className="text-[11px] font-semibold text-muted-foreground">Secure & Licensed</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/50 p-3">
              <Zap className="h-5 w-5 text-profit" />
              <span className="text-[11px] font-semibold text-muted-foreground">Instant M-Pesa</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/50 p-3">
              <Users className="h-5 w-5 text-profit" />
              <span className="text-[11px] font-semibold text-muted-foreground">50K+ Traders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
