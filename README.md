# KeyMart

An online store for selling software license keys (Windows, Office, antivirus, …).

Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 + shadcn · Prisma + PostgreSQL ·
Auth.js v5 · Stripe Checkout · Nodemailer.

## Local setup

Requires Node 20+ and Docker Desktop.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   then generate two secrets and paste them into .env:
#   openssl rand -base64 32   -> AUTH_SECRET
#   openssl rand -base64 32   -> KEY_ENCRYPTION_SECRET

# 3. Start Postgres (Docker, host port 5433)
npm run db:up

# 4. Create the schema and load sample data
npm run db:migrate      # applies migrations
npm run db:seed         # 9 products, sample keys, admin + customer users

# 5. Run the app
npm run dev             # http://localhost:3000
```

### Seeded accounts

| Email                | Password     | Role     |
| -------------------- | ------------ | -------- |
| `admin@keymart.test` | `admin12345` | ADMIN    |
| `user@keymart.test`  | `user12345`  | customer |

## Stripe (checkout + fulfillment)

Checkout uses Stripe Checkout in test mode. Add your test keys to `.env`
(`STRIPE_SECRET_KEY`), then run the webhook forwarder in a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# paste the printed "whsec_..." into STRIPE_WEBHOOK_SECRET in .env, then restart `npm run dev`
```

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## Email

Purchased keys are emailed via SMTP (`SMTP_*` in `.env`). If `SMTP_HOST` is empty, a
throwaway [Ethereal](https://ethereal.email) inbox is created automatically in development
and a preview URL is logged to the server console for every message.

## Useful scripts

| Script               | What it does                              |
| -------------------- | ---------------------------------------- |
| `npm run db:up`      | Start the Postgres container             |
| `npm run db:down`    | Stop the Postgres container              |
| `npm run db:migrate` | Apply Prisma migrations (dev)            |
| `npm run db:reset`   | Drop, recreate and re-seed the database  |
| `npm run db:seed`    | Load sample data                         |
| `npm run db:studio`  | Open Prisma Studio                       |

## Project layout

```
app/(shop)      storefront: home, catalog, product, cart, checkout
app/(auth)      login / register
app/account     signed-in customer area (order history, keys)
app/admin       admin area (products, key inventory, orders)
app/api         checkout, Stripe webhook, order status
lib/            db, auth, crypto, stripe, mailer, inventory, cart store
prisma/         schema + seed
```
