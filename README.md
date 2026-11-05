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
| `DATABASE_URL` | Neon pooled connection string (used by the app) |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string (used for migrations) |
| `ADMIN_PASSWORD` | Admin login password. **Change it.** |
| `SESSION_SECRET` | Long random string for signing logins: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NOTIFY_WEBHOOK_URL` | Optional. Slack or Discord incoming-webhook URL to get pinged for each booking |

## Hosting (Google Cloud Run + Neon Postgres)

The whole app (website, API and admin) runs as one container on Cloud Run in Mumbai (`asia-south1`).
The database is Neon Postgres (free tier). Choose the AWS Mumbai (`ap-south-1`) region in Neon so it is close to Cloud Run.

**Option A: from the browser (no tools on your computer)**

1. Neon: sign up at https://neon.tech, create a project in **AWS Asia Pacific (Mumbai)**, and copy two connection strings from **Connect**: the pooled one (host contains `-pooler`) and the direct one (pooling switched off).
2. Google Cloud: https://console.cloud.google.com → create a project → link a billing account (required even for the free tier).
3. **Cloud Run → Deploy container → Service → Continuously deploy from a repository** → set up Cloud Build → connect GitHub → pick this repo, branch `main`, build type **Dockerfile** (path `/Dockerfile`).
4. Region `asia-south1`, **Allow unauthenticated invocations**.
5. Under **Containers → Variables & secrets**, add `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `ADMIN_PASSWORD`, `SESSION_SECRET` (and optionally `NOTIFY_WEBHOOK_URL`). Container port: `8080`.
6. Create. The first build takes about 5 minutes. Database tables are created automatically when the container starts.

After that, every `git push` to `main` builds and deploys a new version.

**Option B: from the terminal** (needs the `gcloud` CLI, logged in with `gcloud auth login`)

```bash
cp env.yaml.example env.yaml   # fill in the values
./deploy.sh
```

**Custom domain:** Cloud Run → your service → **Integrations / Domain mappings**, or put the service behind a load balancer.

## Not built yet

- Online payment (Razorpay/UPI links). Payments are marked manually in the admin.
- Automatic WhatsApp/SMS messages to customers (needs a WhatsApp Business API provider such as Gupshup or Interakt).
- Helper mobile app with live GPS location. Updates are posted by the team from the admin.
- Several admin accounts. There is one shared password today.
