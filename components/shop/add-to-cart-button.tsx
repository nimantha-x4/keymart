"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/lib/cart-store";

type Props = {
  product: Omit<CartLine, "quantity">;
  quantity?: number;
  disabled?: boolean;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  label?: string;
};

export function AddToCartButton({
  product,
  quantity = 1,
  disabled,
  size = "default",
  variant = "default",
  className,
  label = "Add to cart",
}: Props) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(product, quantity);
    setJustAdded(true);
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View cart",
        onClick: () => router.push("/cart"),
      },
    });
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={handleAdd}
    >
      {justAdded ? (
        <Check className="size-4" />
      ) : (
        <ShoppingCart className="size-4" />
      )}
      {disabled ? "Out of stock" : justAdded ? "Added" : label}
    </Button>
  );
}
