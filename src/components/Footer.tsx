import { TrendingUp } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-6">
    <div className="container mx-auto px-4 text-center">
      <div className="mb-3 flex items-center justify-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold">Profit<span className="text-gradient-brand">254</span></span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Trading involves risk. Only trade with money you can afford to lose. 18+ only. © 2026 Profit254
      </p>
    </div>
  </footer>
);

export default Footer;
