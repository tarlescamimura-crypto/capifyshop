import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCartSync } from "@/hooks/useCartSync";
import { Toaster } from "@/components/ui/sonner";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCw,
  Headphones,
  Zap,
  Award,
  Smartphone,
  Sparkles,
  CreditCard,
  Package,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Capify — Acessórios tech para todos os celulares" },
      {
        name: "description",
        content:
          "Capas, carregadores, fones e acessórios premium compatíveis com iPhone, Samsung, Xiaomi e mais. Frete rápido, garantia e checkout 100% seguro.",
      },
      { property: "og:title", content: "Capify — Acessórios tech para todos os celulares" },
      {
        property: "og:description",
        content:
          "Loja oficial Capify. Acessórios premium para todos os celulares com frete rápido e garantia.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  useCartSync();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(50),
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) if (p.node.productType) set.add(p.node.productType);
    return Array.from(set);
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const filtered = useMemo(() => {
    if (activeCategory === "Todos") return products;
    return products.filter((p) => p.node.productType === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-right" richColors />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium mb-6 animate-pulse-ring">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Compatível com todos os celulares</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[0.95]">
                Tecnologia que <span className="text-primary">vibra</span> com você.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Acessórios premium para iPhone, Samsung, Xiaomi e mais. Design, performance e
                garantia em um único lugar.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-glow"
                  asChild
                >
                  <a href="#produtos">
                    Ver produtos <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold border-border bg-card hover:bg-secondary"
                  asChild
                >
                  <a href="#categorias">Explorar categorias</a>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <Stat value="36+" label="Produtos" />
                <Stat value="12K+" label="Clientes" />
                <Stat value="4.9★" label="Avaliação" />
              </div>
            </div>

            {/* Floating product grid */}
            <div className="relative h-[480px] hidden lg:block">
              <FloatingCard className="absolute top-0 left-8 w-48 animate-float-slow">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/40 to-secondary border border-primary/30" />
                <p className="mt-2 text-xs font-semibold">Capa MagSafe</p>
                <p className="text-xs text-primary">R$ 129,90</p>
              </FloatingCard>
              <FloatingCard className="absolute top-20 right-0 w-56 animate-float-medium">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-secondary to-card border border-border" />
                <p className="mt-2 text-xs font-semibold">Carregador 65W</p>
                <p className="text-xs text-primary">R$ 199,00</p>
              </FloatingCard>
              <FloatingCard className="absolute bottom-0 left-0 w-52 animate-float-fast">
                <div className="aspect-square rounded-xl bg-gradient-to-tr from-card via-secondary to-primary/30 border border-border" />
                <p className="mt-2 text-xs font-semibold">Fone Wireless</p>
                <p className="text-xs text-primary">R$ 349,90</p>
              </FloatingCard>
              <FloatingCard className="absolute bottom-12 right-12 w-44 animate-float-slow">
                <div className="aspect-square rounded-xl bg-gradient-to-bl from-primary/30 to-card border border-primary/20" />
                <p className="mt-2 text-xs font-semibold">Cabo USB-C</p>
                <p className="text-xs text-primary">R$ 49,90</p>
              </FloatingCard>
            </div>
          </div>
        </div>

        {/* Trust badges marquee */}
        <div className="border-y border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <TrustBadge icon={Truck} title="Frete grátis" desc="Acima de R$ 199" />
              <TrustBadge icon={ShieldCheck} title="Compra segura" desc="SSL + Shopify" />
              <TrustBadge icon={RotateCw} title="7 dias para troca" desc="Sem perguntas" />
              <TrustBadge icon={Headphones} title="Suporte 24/7" desc="WhatsApp & email" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Catálogo"
            title="Filtre por categoria"
            description="Encontre o acessório perfeito para o seu setup."
          />
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <CategoryChip
              label="Todos"
              active={activeCategory === "Todos"}
              onClick={() => setActiveCategory("Todos")}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c}
                label={c}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos" className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-muted-foreground mt-1">
                Adicione produtos na sua loja Shopify para vê-los aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="py-20 bg-card/40 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Por que Capify"
            title="Mais que acessórios. Uma experiência."
            description="Cada detalhe pensado para quem vive conectado."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature
              icon={Zap}
              title="Performance real"
              desc="Carregamento rápido e estável, certificado pelos principais fabricantes."
            />
            <Feature
              icon={ShieldCheck}
              title="Garantia 12 meses"
              desc="Defeito de fabricação? A gente troca, sem burocracia."
            />
            <Feature
              icon={Truck}
              title="Envio expresso"
              desc="Despachamos em até 24h para todo o Brasil."
            />
            <Feature
              icon={Award}
              title="Curadoria premium"
              desc="Apenas marcas e materiais aprovados pelo nosso time."
            />
            <Feature
              icon={CreditCard}
              title="Parcele em até 12x"
              desc="Sem juros nos principais cartões. Pix com 5% off."
            />
            <Feature
              icon={Headphones}
              title="Suporte gente boa"
              desc="Time real, em português, pronto pra resolver na hora."
            />
          </div>
        </div>
      </section>

      {/* COMPATIBILIDADE */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Compatibilidade"
            title="Funciona com o seu celular."
            description="Independente da marca, temos o acessório certo."
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["iPhone", "Samsung", "Xiaomi", "Motorola", "Google Pixel", "OnePlus", "Asus", "Realme"].map(
              (brand) => (
                <div
                  key={brand}
                  className="px-5 py-3 rounded-xl bg-card border border-border flex items-center gap-2 font-display font-semibold hover:border-primary/50 hover:shadow-glow transition"
                >
                  <Smartphone className="w-4 h-4 text-primary" />
                  {brand}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 lg:p-16 text-center shadow-glow">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <Star className="w-10 h-10 mx-auto mb-4 text-white" />
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white text-balance">
                Use o cupom <span className="bg-black/30 px-3 py-1 rounded-lg">CAPIFY10</span> e
                ganhe 10% na primeira compra.
              </h2>
              <p className="mt-4 text-white/90 text-lg">
                Tempo limitado. Válido para todo o site, sem mínimo.
              </p>
              <Button
                size="lg"
                className="mt-8 h-12 px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <a href="#produtos">
                  Aproveitar agora <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold">
              Cap<span className="text-primary">ify</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Capify. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">Checkout seguro via Shopify</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-left">
      <div className="font-display text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function FloatingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-3 rounded-2xl bg-card border border-border shadow-card ${className}`}>
      {children}
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Truck;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-balance">{title}</h2>
      {description && (
        <p className="mt-3 text-muted-foreground text-balance">{description}</p>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-glow"
          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Truck;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-glow transition group">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary transition">
        <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition" />
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
