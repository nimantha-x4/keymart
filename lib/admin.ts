import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { availableStockByProduct } from "@/lib/products";

export const LOW_STOCK_THRESHOLD = 3;

export async function getAdminSession() {
  const session = await auth();
  return session?.user?.role === "ADMIN" ? session : null;
}

export async function getAdminStats() {
  const [agg, statusCounts, keysSold, productCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "FULFILLED" },
      _sum: { totalCents: true },
      _count: true,
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.licenseKey.count({ where: { status: "SOLD" } }),
    prisma.product.count(),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count]),
  );

  return {
    revenueCents: agg._sum.totalCents ?? 0,
    fulfilledOrders: agg._count,
    pendingOrders: byStatus.PENDING ?? 0,
    totalOrders: statusCounts.reduce((n, s) => n + s._count, 0),
    keysSold,
    productCount,
  };
}

export async function getAdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  const [available, sold] = await Promise.all([
    availableStockByProduct(products.map((p) => p.id)),
    prisma.licenseKey.groupBy({
      by: ["productId"],
      where: { status: "SOLD", productId: { in: products.map((p) => p.id) } },
      _count: { _all: true },
    }),
  ]);
  const soldMap = new Map(sold.map((s) => [s.productId, s._count._all]));

  return products.map((p) => ({
    ...p,
    stock: available.get(p.id) ?? 0,
    sold: soldMap.get(p.id) ?? 0,
  }));
}

export async function getAdminOrders(status?: string) {
  return prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: { select: { quantity: true } } },
  });
}
