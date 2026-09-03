import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe is optional in development. When STRIPE_SECRET_KEY is not a real key,
 * checkout falls back to a local mock payment page and fulfillment is triggered
 * directly instead of via a Stripe webhook.
 */
export const isStripeConfigured =
  typeof secretKey === "string" &&
  secretKey.startsWith("sk_") &&
  secretKey.length > 20 &&
  !secretKey.includes("xxx");

export const stripe: Stripe | null = isStripeConfigured
  ? new Stripe(secretKey as string)
  : null;

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
