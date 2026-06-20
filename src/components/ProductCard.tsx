import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Adicionado ao carrinho", {
      description: product.node.title,
      position: "top-right",
    });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/60 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-secondary relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.node.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Sem imagem
          </div>
        )}
        {variant && !variant.availableForSale && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded bg-background/80 backdrop-blur">
            Esgotado
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.node.productType && (
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">
            {product.node.productType}
          </span>
        )}
        <h3 className="font-display font-bold text-lg leading-tight line-clamp-2">
          {product.node.title}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <span className="font-display text-xl font-bold">
            {price.currencyCode === "BRL" ? "R$" : price.currencyCode}{" "}
            {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || !variant}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" /> Comprar
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
