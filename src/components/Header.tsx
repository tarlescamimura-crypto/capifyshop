import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
            Cap<span className="text-primary">ify</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="/#produtos" className="text-muted-foreground hover:text-foreground transition">
            Produtos
          </a>
          <a href="/#categorias" className="text-muted-foreground hover:text-foreground transition">
            Categorias
          </a>
          <a href="/#diferenciais" className="text-muted-foreground hover:text-foreground transition">
            Por que Capify
          </a>
          <a href="/#contato" className="text-muted-foreground hover:text-foreground transition">
            Contato
          </a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
