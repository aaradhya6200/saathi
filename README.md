# Saathi

Website and operations dashboard for Saathi: book a verified helper by the hour.

## What's in it

**Public site**
- `/`: home page (services, pricing with estimator, safety, FAQ)
- `/book`: booking form. Each booking gets a code like `SA-7K3P9`.
- `/track`: families check status, helper and updates with the code and phone number
- `/join`: helper application form

**Admin** (`/admin`, password protected)
- Overview: new requests, upcoming bookings for the next 7 days, applications, this month's revenue
- Bookings: search and filter, assign a helper, change status, post updates the family sees, enter time used and purchases (the bill is calculated automatically), mark as paid, private notes
- Helpers: move applicants through Applied → Interview → Active, mark police verification

**Backend**
- API: `POST /api/bookings`, `POST /api/track`, `POST /api/helpers`
- Database: Prisma ORM. SQLite locally, Postgres in production
- Input validation, spam honeypot, per-IP rate limits, signed admin session cookie
- Optional webhook notification (Slack/Discord/Zapier) for every new booking and application

Prices live in one place: `src/lib/pricing.ts`.

## Run it on your computer

Put the two Neon connection strings (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) in `.env`, then:

```bash
npm install
npx prisma migrate deploy  # creates the tables (safe to run again)
npm run dev
```

Tip: in Neon, create a separate "dev" branch of the database for local testing so test bookings don't mix with real ones.

Open http://localhost:3000. The admin is at http://localhost:3000/admin, and the password is `ADMIN_PASSWORD` in `.env`.

Browse the raw database with `npm run db:studio`.

## Settings (`.env`)

| Name | What it does |
|---|---|
| `DATABASE_URL` | Database connection |
| `ADMIN_PASSWORD` | Admin login password. **Change it.** |
| `SESSION_SECRET` | Long random string for signing logins: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NOTIFY_WEBHOOK_URL` | Optional. Slack or Discord incoming-webhook URL to get pinged for each booking |

## Hosting (Vercel + Neon Postgres, both have free tiers)

1. At https://vercel.com, sign up with GitHub and import this repository. Don't deploy yet if it asks for settings; the first deploy may fail until step 3 is done, which is fine.
2. Project → **Storage** → **Create Database** → **Neon** (Serverless Postgres) → connect it to this project. This sets `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.
3. Project → **Settings → Environment Variables**: add `ADMIN_PASSWORD` and `SESSION_SECRET`.
4. **Deployments** → latest → **Redeploy**. Each deploy runs `prisma migrate deploy` first (see `vercel.json`), so the tables are created automatically.
5. Optional: **Settings → Domains** to add your own domain (e.g. saathi.in).

Every `git push` to `main` deploys a new version automatically.

## Not built yet

- Online payment (Razorpay/UPI links). Payments are marked manually in the admin.
- Automatic WhatsApp/SMS messages to customers (needs a WhatsApp Business API provider such as Gupshup or Interakt).
- Helper mobile app with live GPS location. Updates are posted by the team from the admin.
- Several admin accounts. There is one shared password today.
