import { TrendingUp, ArrowDown } from "lucide-react";

const HeroSection = () => {
  const scrollToTrade = () => {
    document.getElementById("trade")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: "linear-gradient(hsl(145 80% 42% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(145 80% 42% / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="animate-slide-up mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Kenya's Simplest Trading Platform
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Predict.{" "}
            <span className="text-gradient-brand">Trade.</span>{" "}
            <span className="text-destructive">Profit.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
            Will the price go <span className="font-semibold text-primary">UP</span> or{" "}
            <span className="font-semibold text-destructive">DOWN</span>? That's all you need to know.
            Deposit & withdraw instantly via M-Pesa.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={scrollToTrade}
              className="glow-green rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105"
            >
              Start Trading Now
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-xl border border-border bg-secondary px-8 py-4 text-lg font-medium text-foreground transition-all hover:bg-accent"
            >
              How It Works
            </button>
          </div>
        </div>

        <button
          onClick={scrollToTrade}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
