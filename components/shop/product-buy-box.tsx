"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/lib/cart-store";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

export function ProductBuyBox({
  product,
  stock,
}: {
  product: Omit<CartLine, "quantity">;
  stock: number;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const max = Math.min(stock, 10);
  const inStock = stock > 0;

  function buyNow() {
    add(product, qty);
    router.push("/cart");
  }

  return (
    <div className="space-y-3">
      {inStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <div className="flex items-center rounded-lg border">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={qty >= max}
              onClick={() => setQty((q) => Math.min(max, q + 1))}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">{stock} available</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <AddToCartButton
          product={product}
          quantity={qty}
          disabled={!inStock}
          size="lg"
          variant="outline"
        />
        <Button type="button" size="lg" disabled={!inStock} onClick={buyNow}>
          Buy now
        </Button>
      </div>
    </div>
  );
}
