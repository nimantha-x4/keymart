import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <nav className="mb-8 flex gap-4 border-b text-sm">
          <Link
            href="/account"
            className="border-b-2 border-transparent pb-2 text-muted-foreground hover:text-foreground"
          >
            Overview
          </Link>
          <Link
            href="/account/orders"
            className="border-b-2 border-transparent pb-2 text-muted-foreground hover:text-foreground"
          >
            Orders
          </Link>
        </nav>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
