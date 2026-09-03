import { prisma } from "@/lib/db";
import { sendOrderKeysEmail } from "@/lib/mailer";

export class InsufficientStockError extends Error {
  constructor(public readonly productName: string) {
    super(`Not enough stock for ${productName}`);
    this.name = "InsufficientStockError";
  }
}

/**
 * Reserve AVAILABLE license keys for every line of an order. Runs in a single
 * transaction: if any line is short on stock, nothing is reserved and an
 * InsufficientStockError is thrown. Idempotent — re-running tops up to the
 * required quantity rather than double-reserving.
 */
export async function reserveKeysForOrder(orderId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const items = await tx.orderItem.findMany({ where: { orderId } });

    for (const item of items) {
      const alreadyHeld = await tx.licenseKey.count({
        where: {
          orderItemId: item.id,
          status: { in: ["RESERVED", "SOLD"] },
        },
      });
      const need = item.quantity - alreadyHeld;
      if (need <= 0) continue;

      const candidates = await tx.licenseKey.findMany({
        where: { productId: item.productId, status: "AVAILABLE" },
        orderBy: { createdAt: "asc" },
        take: need,
        select: { id: true },
      });
      if (candidates.length < need) {
        throw new InsufficientStockError(item.productName);
      }

      const ids = candidates.map((c) => c.id);
      const { count } = await tx.licenseKey.updateMany({
        where: { id: { in: ids }, status: "AVAILABLE" },
        data: {
          status: "RESERVED",
          orderItemId: item.id,
          reservedAt: new Date(),
        },
      });
      // Lost a race for one of the rows — abort the whole reservation.
      if (count < need) {
        throw new InsufficientStockError(item.productName);
      }
    }
  });
}

/**
 * Mark an order paid + fulfilled: reserved keys become SOLD and the keys email
 * goes out. Idempotent, so it is safe to call from both a Stripe webhook and its
 * retries (or from the mock payment flow).
 */
export async function fulfillOrder(
  orderId: string,
  opts: { stripePaymentIntentId?: string | null } = {},
): Promise<{ orderNumber: string; alreadyFulfilled: boolean }> {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error(`Order ${orderId} not found`);

    if (order.status === "FULFILLED") {
      return { orderNumber: order.orderNumber, alreadyFulfilled: true };
    }

    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: { id: true },
    });
    await tx.licenseKey.updateMany({
      where: {
        orderItemId: { in: items.map((i) => i.id) },
        status: "RESERVED",
      },
      data: { status: "SOLD", soldAt: new Date() },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "FULFILLED",
        paidAt: new Date(),
        stripePaymentIntentId:
          opts.stripePaymentIntentId ?? order.stripePaymentIntentId,
      },
    });

    return { orderNumber: order.orderNumber, alreadyFulfilled: false };
  });

  if (!result.alreadyFulfilled) {
    try {
      await sendOrderKeysEmail(result.orderNumber);
    } catch (err) {
      console.error(`[fulfillOrder] email failed for ${result.orderNumber}`, err);
    }
  }
  return result;
}

/** Release a pending order's reserved keys back to the pool. */
export async function releaseOrderReservation(
  orderId: string,
  finalStatus: "EXPIRED" | "FAILED" = "EXPIRED",
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order || order.status === "FULFILLED" || order.status === "REFUNDED") {
      return;
    }

    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: { id: true },
    });
    await tx.licenseKey.updateMany({
      where: {
        orderItemId: { in: items.map((i) => i.id) },
        status: "RESERVED",
      },
      data: { status: "AVAILABLE", orderItemId: null, reservedAt: null },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: finalStatus },
    });
  });
}
