import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingSchema, fieldErrors } from "@/lib/validation";
import { newBookingCode } from "@/lib/bookingCode";
import { estimate, inr, PLANS, type PlanId } from "@/lib/pricing";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { notifyTeam } from "@/lib/notify";

// POST /api/bookings — a customer requests a booking.
export async function POST(req: Request) {
  if (rateLimited("booking:" + clientIp(req))) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const b = parsed.data;
  if (b.website) return NextResponse.json({ ok: true, code: "SA-00000" }); // bot

  // Retry on the rare code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newBookingCode();
    try {
      await db.booking.create({
        data: {
          code,
          customerName: b.customerName,
          customerPhone: b.customerPhone,
          forWhom: b.forWhom,
          area: b.area,
          plan: b.plan,
          date: new Date(b.date + "T00:00:00Z"), // stored as UTC midnight of the chosen day
          startTime: b.startTime,
          hours: b.hours,
          tasks: b.tasks,
          events: { create: { message: "Booking request received. We’ll confirm your helper soon." } },
        },
      });
      const plan = b.plan as PlanId;
      await notifyTeam(
        `New booking ${code}: ${b.customerName} (${b.customerPhone}) for ${b.forWhom}, ${b.area}, ` +
          `${b.date} ${b.startTime}, ${b.hours} h, ${PLANS[plan].label}, est. ${inr(estimate(plan, b.hours))}.\nTasks: ${b.tasks}`,
      );
      return NextResponse.json({ ok: true, code }, { status: 201 });
    } catch (err) {
      if ((err as { code?: string }).code !== "P2002") throw err;
    }
  }
  return NextResponse.json({ error: "Could not create the booking. Please try again." }, { status: 500 });
}
