import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminProducts, LOW_STOCK_THRESHOLD } from "@/lib/admin";
import { formatUsd } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products · Admin" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus className="size-4" />
          New product
        </Link>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Sold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {p.category.name}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUsd(p.priceCents)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right tabular-nums",
                    p.stock === 0
                      ? "text-destructive"
                      : p.stock < LOW_STOCK_THRESHOLD
                        ? "text-amber-600 dark:text-amber-400"
                        : "",
                  )}
                >
                  <Link
                    href={`/admin/products/${p.id}/keys`}
                    className="hover:underline"
                  >
                    {p.stock}
                  </Link>
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {p.sold}
                </TableCell>
                <TableCell>
                  {p.published ? (
                    <Badge variant="secondary">Published</Badge>
                  ) : (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
