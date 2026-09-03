import Link from "next/link";
import { KeyRound, Search } from "lucide-react";
import { getCategories } from "@/lib/products";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/shop/cart-button";
import { MobileNav } from "@/components/shop/mobile-nav";

export async function SiteHeader() {
  const categories = await getCategories();

  const navLinks = [
    { href: "/products", label: "All products" },
    ...categories.map((c) => ({
      href: `/products?category=${c.slug}`,
      label: c.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <MobileNav links={navLinks} />

        <Link href="/" className="flex items-center gap-2 font-semibold">
          <KeyRound className="size-5 text-primary" />
          <span className="text-base">KeyMart</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form
            action="/products"
            className="relative hidden sm:block"
            role="search"
          >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              placeholder="Search keys…"
              className="h-8 w-40 pl-8 lg:w-56"
            />
          </form>

          <CartButton />

          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
