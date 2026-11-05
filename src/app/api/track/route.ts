import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackSchema, fieldErrors } from "@/lib/validation";
import { clientIp, rateLimited } from "@/lib/rateLimit";

// POST /api/track — look up a booking by code + the phone number used to book.
// Both are required so codes alone can't be guessed to read someone's booking.
export async function POST(req: Request) {
  if (rateLimited("track:" + clientIp(req), 20)) {
    return NextResponse.json({ error: "Too many lookups. Please try again in a few minutes." }, { status: 429 });
  }
  const parsed = trackSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 400 });

  const { code, phone } = parsed.data;
  const b = await db.booking.findUnique({
    where: { code },
    include: { helper: true, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!b || b.customerPhone !== phone) {
    return NextResponse.json({ error: "No booking matches that code and phone number." }, { status: 404 });
  }

  return NextResponse.json({
    code: b.code,
    status: b.status,
    forWhom: b.forWhom,
    area: b.area,
    date: b.date.toISOString().slice(0, 10),
    startTime: b.startTime,
    hours: b.hours,
    plan: b.plan,
    tasks: b.tasks,
    helper: b.helper ? { name: b.helper.name, verified: b.helper.verified } : null,
    bill:
      b.status === "COMPLETED"
        ? { minutesUsed: b.minutesUsed, timeCharge: b.timeCharge, purchases: b.purchases, paid: b.paid }
        : null,
    events: b.events.map((e) => ({ at: e.createdAt.toISOString(), message: e.message })),
  });
}
