import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <Card className="p-8">
        <h1 className="text-lg font-semibold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No charge was made and your reserved keys have been released back to
          stock. Your cart is still saved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/cart" className={cn(buttonVariants({ size: "sm" }))}>
            Return to cart
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Keep browsing
          </Link>
        </div>
      </Card>
    </div>
  );
}
