import { z } from "zod";
import { PLAN_IDS } from "./pricing";

const phone = z
  .string()
  .transform((v) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""))
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a 10-digit Indian mobile number.");

const text = (max: number, msg: string) => z.string().trim().min(1, msg).max(max);

export const bookingSchema = z.object({
  customerName: text(80, "Enter your name."),
  customerPhone: phone,
  forWhom: text(120, "Tell us who the help is for."),
  area: text(80, "Enter the area, so we can find a nearby helper."),
  plan: z.enum(PLAN_IDS as [string, ...string[]]),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.")
    .refine((d) => d >= new Date(Date.now() - 864e5).toISOString().slice(0, 10), "Pick today or a later date."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a start time."),
  hours: z.coerce.number().min(2, "The minimum booking is 2 hours.").max(10),
  tasks: text(2000, "List at least one task or stop."),
  // Honeypot: real people leave this empty.
  website: z.string().max(0).optional(),
});

export const helperSchema = z.object({
  name: text(80, "Enter your full name."),
  phone,
  area: text(80, "Enter the area you live in."),
  languages: z.string().trim().max(120).default(""),
  hasBike: z.boolean().default(false),
  availability: z.enum(["Mornings", "Afternoons", "Full day", "Weekends only"]),
  about: z.string().trim().max(2000).default(""),
  website: z.string().max(0).optional(),
});

export const trackSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^SA-[A-Z0-9]{5}$/, "Enter the booking code, like SA-7K3P9."),
  phone,
});

/** Flatten zod errors into { field: message } for the forms. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
