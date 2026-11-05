"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { HELPER_STATUSES, STATUSES, STATUS_LABEL, type Status } from "@/lib/booking";
import { timeCharge, inr, type PlanId } from "@/lib/pricing";
import { rateLimited } from "@/lib/rateLimit";

// ---------- Login ----------

export async function login(_: { error?: string } | undefined, formData: FormData) {
  if (rateLimited("admin-login", 10, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Wait 15 minutes and try again." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { error: "That password is not correct." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- Bookings ----------

const STATUS_MESSAGE: Partial<Record<Status, string>> = {
  CONFIRMED: "Booking confirmed.",
  IN_PROGRESS: "Your Saathi has started the booking.",
  CANCELLED: "Booking cancelled.",
};

export async function setBookingStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status")) as Status;
  if (!STATUSES.includes(status) || status === "COMPLETED") return; // completing goes through completeBooking
  await db.booking.update({
    where: { id },
    data: { status, events: { create: { message: STATUS_MESSAGE[status] ?? `Status: ${STATUS_LABEL[status]}.` } } },
  });
  revalidatePath(`/admin/bookings/${id}`);
}

export async function assignHelper(id: string, formData: FormData) {
  await requireAdmin();
  const helperId = String(formData.get("helperId") ?? "");
  if (!helperId) {
    await db.booking.update({ where: { id }, data: { helperId: null } });
  } else {
    const helper = await db.helper.findFirst({ where: { id: helperId, status: "ACTIVE" } });
    if (!helper) return;
    await db.booking.update({
      where: { id },
      data: {
        helperId,
        events: { create: { message: `${helper.name} will be your Saathi${helper.verified ? " (police verified)" : ""}.` } },
      },
    });
  }
  revalidatePath(`/admin/bookings/${id}`);
}

export async function addUpdate(id: string, formData: FormData) {
  await requireAdmin();
  const message = String(formData.get("message") ?? "").trim().slice(0, 500);
  if (!message) return;
  await db.bookingEvent.create({ data: { bookingId: id, message } });
  revalidatePath(`/admin/bookings/${id}`);
}

export async function completeBooking(id: string, formData: FormData) {
  await requireAdmin();
  const hours = Number(formData.get("hoursUsed") ?? 0);
  const mins = Number(formData.get("minsUsed") ?? 0);
  const purchases = Math.max(0, Math.round(Number(formData.get("purchases") ?? 0)));
  const minutesUsed = Math.round(hours * 60 + mins);
  if (!Number.isFinite(minutesUsed) || minutesUsed <= 0 || !Number.isFinite(purchases)) return;

  const booking = await db.booking.findUniqueOrThrow({ where: { id } });
  const charge = timeCharge(booking.plan as PlanId, minutesUsed);
  await db.booking.update({
    where: { id },
    data: {
      status: "COMPLETED",
      minutesUsed,
      purchases,
      timeCharge: charge,
      events: {
        create: {
          message: `Booking completed. ${Math.floor(minutesUsed / 60)} h ${minutesUsed % 60} m used. Total ${inr(charge + purchases)} (${inr(charge)} time + ${inr(purchases)} purchases).`,
        },
      },
    },
  });
  revalidatePath(`/admin/bookings/${id}`);
}

export async function setPaid(id: string, formData: FormData) {
  await requireAdmin();
  const paid = formData.get("paid") === "1";
  await db.booking.update({
    where: { id },
    data: { paid, ...(paid ? { events: { create: { message: "Payment received. Thank you!" } } } : {}) },
  });
  revalidatePath(`/admin/bookings/${id}`);
}

export async function saveNotes(id: string, formData: FormData) {
  await requireAdmin();
  await db.booking.update({ where: { id }, data: { adminNotes: String(formData.get("notes") ?? "").slice(0, 4000) } });
  revalidatePath(`/admin/bookings/${id}`);
}

// ---------- Helpers ----------

export async function setHelperStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!(HELPER_STATUSES as readonly string[]).includes(status)) return;
  await db.helper.update({ where: { id }, data: { status } });
  revalidatePath("/admin/helpers");
}

export async function setHelperVerified(id: string, formData: FormData) {
  await requireAdmin();
  await db.helper.update({ where: { id }, data: { verified: formData.get("verified") === "1" } });
  revalidatePath("/admin/helpers");
}
