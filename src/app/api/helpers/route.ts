import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { helperSchema, fieldErrors } from "@/lib/validation";
import { clientIp, rateLimited } from "@/lib/rateLimit";
import { notifyTeam } from "@/lib/notify";

// POST /api/helpers — someone applies to become a helper.
export async function POST(req: Request) {
  if (rateLimited("helper:" + clientIp(req), 3)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }
  const parsed = helperSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ errors: fieldErrors(parsed.error) }, { status: 400 });
  const h = parsed.data;
  if (h.website) return NextResponse.json({ ok: true });

  const existing = await db.helper.findUnique({ where: { phone: h.phone } });
  if (existing) {
    return NextResponse.json(
      { errors: { phone: "We already have an application with this number. We’ll be in touch." } },
      { status: 409 },
    );
  }

  await db.helper.create({
    data: {
      name: h.name,
      phone: h.phone,
      area: h.area,
      languages: h.languages,
      hasBike: h.hasBike,
      availability: h.availability,
      about: h.about,
    },
  });
  await notifyTeam(`New helper application: ${h.name} (${h.phone}), ${h.area}, ${h.availability}.`);
  return NextResponse.json({ ok: true }, { status: 201 });
}
