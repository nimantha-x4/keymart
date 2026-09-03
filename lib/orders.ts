import crypto from "node:crypto";
import type { Session } from "next-auth";
import { prisma } from "@/lib/db";
import { decryptSecret } from "@/lib/crypto";
import { verifyOrderToken } from "@/lib/order-token";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderNumber(): string {
  let body = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) body += ALPHABET[bytes[i] % ALPHABET.length];
  return `KM-${body}`;
}

export type OrderWithDetail = NonNullable<
  Awaited<ReturnType<typeof getOrderByNumber>>
>;

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: { licenseKeys: { orderBy: { createdAt: "asc" } } },
      },
    },
  });
}

type Order = { userId: string | null; email: string };

/** Can this requester see the order's keys? */
export function canViewOrder(
  order: Order,
  opts: { session?: Session | null; token?: string | null; orderNumber: string },
): boolean {
  const { session, token, orderNumber } = opts;
  if (session?.user?.role === "ADMIN") return true;
  if (order.userId && session?.user?.id === order.userId) return true;
  if (verifyOrderToken(orderNumber, token ?? null)) return true;
  return false;
}

/** Flatten an order's SOLD keys into a display list (decrypted). */
export function decryptOrderKeys(order: OrderWithDetail) {
  return order.items.map((item) => ({
    productName: item.productName,
    quantity: item.quantity,
    keys: item.licenseKeys
      .filter((k) => k.status === "SOLD")
      .map((k) =>
        decryptSecret({
          ciphertext: k.secretCiphertext,
          iv: k.secretIv,
          authTag: k.secretAuthTag,
        }),
      ),
  }));
}
