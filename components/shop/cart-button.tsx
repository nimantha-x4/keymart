"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectCartCount, useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

export function CartButton({ className }: { className?: string }) {
  const count = useCart(selectCartCount);
  const hydrated = useHydrated();
  const showCount = hydrated && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={`Cart${showCount ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "relative",
        className,
      )}
    >
      <ShoppingCart className="size-4" />
      {showCount && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
