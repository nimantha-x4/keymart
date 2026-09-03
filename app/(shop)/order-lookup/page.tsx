import type { Metadata } from "next";
import { OrderLookup } from "@/components/shop/order-lookup";

export const metadata: Metadata = {
  title: "Find my order",
  description: "Look up a guest order and re-download your license keys.",
};

export default function OrderLookupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        Find my order
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Enter your order number and the email you used at checkout to view your
        license keys again.
      </p>
      <OrderLookup />
    </div>
  );
}
