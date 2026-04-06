import { ArrowUpCircle, ArrowDownCircle, Zap } from "lucide-react";

const steps = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Pick an Asset",
    description: "Choose from popular assets like BTC, Gold, EUR/USD or stocks.",
    color: "text-primary",
  },
  {
    icon: <ArrowUpCircle className="h-8 w-8" />,
    title: "Predict UP or DOWN",
    description: "Will the price go up or down? That's your only decision.",
    color: "text-profit",
  },
  {
    icon: <ArrowDownCircle className="h-8 w-8" />,
    title: "Collect Your Profit",
    description: "If you're right, earn up to 85% profit. Withdraw to M-Pesa instantly.",
    color: "text-loss",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
        How It <span className="text-gradient-brand">Works</span>
      </h2>
      <p className="mb-12 text-center text-muted-foreground">Trading made as simple as 1-2-3</p>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-muted-foreground hover:bg-secondary"
          >
            <div className={`mb-4 inline-flex rounded-xl bg-secondary p-4 ${step.color} transition-transform group-hover:scale-110`}>
              {step.icon}
            </div>
            <div className="mb-1 text-sm font-semibold text-muted-foreground">Step {i + 1}</div>
            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
