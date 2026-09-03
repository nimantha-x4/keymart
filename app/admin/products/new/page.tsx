import type { Metadata } from "next";
import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New product · Admin" };

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
