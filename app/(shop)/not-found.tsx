import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        We couldn&rsquo;t find that
      </h1>
      <p className="text-sm text-muted-foreground">
        This product or page isn&rsquo;t available. It may have sold out or been
        removed.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/products" className={cn(buttonVariants({ size: "sm" }))}>
          Browse all products
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
