import { useState } from "react";
import { TrendingUp, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Profit<span className="text-gradient-brand">254</span>
          </span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {["trade", "wallet"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-medium capitalize text-muted-foreground transition-colors hover:text-foreground"
            >
              {id.replace("-", " ")}
            </button>
          ))}
          <button
            onClick={() => scrollTo("trade")}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-green"
          >
            Start Trading
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          {["trade", "wallet"].map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full py-3 text-left text-sm font-medium capitalize text-muted-foreground"
            >
              {id.replace("-", " ")}
            </button>
          ))}
          <button
            onClick={() => scrollTo("trade")}
            className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            Start Trading
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
