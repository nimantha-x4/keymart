import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold">
        <KeyRound className="size-5 text-primary" />
        <span className="text-lg">KeyMart</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <Link
        href="/"
        className="mt-8 text-xs text-muted-foreground hover:text-foreground"
      >
        ← Back to store
      </Link>
    </div>
  );
}
