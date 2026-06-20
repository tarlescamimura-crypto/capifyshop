import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProductByHandle } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShoppingCart, ShieldCheck, Truck, RotateCw } from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <p className="text-lg font-semibold">Não foi possível carregar o produto.</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <p className="text-lg font-semibold">Produto não encontrado</p>
        <Link to="/" className="text-primary text-sm mt-2 inline-block">
          Voltar à loja
        </Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const p = await fetchProductByHandle(handle);
      if (!p) throw notFound();
      return p;
    },
  });

  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const variants = product?.node.variants.edges ?? [];
  const selectedVariant =
    variants.find((v) => v.node.id === variantId)?.node ?? variants[0]?.node;
  const images = product?.node.images.edges ?? [];

  const handleAdd = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions ?? [],
    });
    toast.success("Adicionado ao carrinho", {
      description: product.node.title,
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" richColors />
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {isLoading || !product ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                {images[activeImage] && (
                  <img
                    src={images[activeImage].node.url}
                    alt={images[activeImage].node.altText ?? product.node.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        activeImage === i ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {product.node.productType && (
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  {product.node.productType}
                </span>
              )}
              <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">
                {product.node.title}
              </h1>
              <div className="mt-4 font-display text-3xl font-bold text-primary">
                {selectedVariant?.price.currencyCode === "BRL"
                  ? "R$"
                  : selectedVariant?.price.currencyCode}{" "}
                {selectedVariant && parseFloat(selectedVariant.price.amount).toFixed(2)}
              </div>

              {product.node.options.length > 0 &&
                product.node.options[0].values.length > 1 && (
                  <div className="mt-6 space-y-4">
                    {product.node.options.map((opt) => (
                      <div key={opt.name}>
                        <div className="text-sm font-semibold mb-2">{opt.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {variants.map((v) => {
                            const value = v.node.selectedOptions.find(
                              (o) => o.name === opt.name,
                            )?.value;
                            if (!value) return null;
                            const isActive = (selectedVariant?.id ?? variants[0].node.id) === v.node.id;
                            return (
                              <button
                                key={v.node.id}
                                onClick={() => setVariantId(v.node.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                                  isActive
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {v.node.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <Button
                size="lg"
                onClick={handleAdd}
                disabled={cartLoading || !selectedVariant?.availableForSale}
                className="mt-8 w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-glow"
              >
                {cartLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {selectedVariant?.availableForSale ? "Adicionar ao carrinho" : "Esgotado"}
                  </>
                )}
              </Button>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Perk icon={Truck} label="Frete rápido" />
                <Perk icon={ShieldCheck} label="Garantia 12m" />
                <Perk icon={RotateCw} label="7 dias troca" />
              </div>

              {product.node.description && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h2 className="font-display text-xl font-bold mb-3">Descrição</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {product.node.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Perk({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-card border border-border text-center">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
