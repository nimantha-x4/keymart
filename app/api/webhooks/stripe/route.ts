import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { fulfillOrder, releaseOrderReservation } from "@/lib/inventory";
import { stripe, stripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

async function orderIdFromSession(session: Stripe.Checkout.Session) {
  const orderNumber =
    session.client_reference_id ?? session.metadata?.orderNumber ?? null;
  if (!orderNumber) return null;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true },
  });
  return order?.id ?? null;
}

export async function POST(req: Request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 501 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, signature, stripeWebhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = await orderIdFromSession(session);
        if (orderId) {
          await fulfillOrder(orderId, {
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          });
        }
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = await orderIdFromSession(session);
        if (orderId) await releaseOrderReservation(orderId, "EXPIRED");
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] handler error for ${event.type}`, err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
