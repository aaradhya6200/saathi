// All prices in rupees. Change them here and the whole site follows.

export const PLANS = {
  PAYG: { label: "Pay as you go", rate: 300, unit: "hour" },
  CARE: { label: "Parent Care", rate: 2999, unit: "month", hoursIncluded: 10 },
  BIZ: { label: "Business runner", rate: 250, unit: "hour" },
} as const;

export type PlanId = keyof typeof PLANS;
export const PLAN_IDS = Object.keys(PLANS) as PlanId[];

export const MIN_HOURS = 2;
export const HELPER_RATE = 150; // what a helper earns per hour

export function hourlyRate(plan: PlanId): number {
  // Parent Care hours are covered by the monthly fee.
  return plan === "CARE" ? 0 : PLANS[plan].rate;
}

/** Estimated time charge for a request, before the booking happens. */
export function estimate(plan: PlanId, hours: number): number {
  return Math.round(hourlyRate(plan) * Math.max(MIN_HOURS, hours));
}

/**
 * Final time charge from the minutes actually used:
 * 2-hour minimum, then billed in 15-minute steps (rounded up).
 */
export function timeCharge(plan: PlanId, minutesUsed: number): number {
  const billable = Math.max(MIN_HOURS * 60, Math.ceil(minutesUsed / 15) * 15);
  return Math.round((billable / 60) * hourlyRate(plan));
}

export function inr(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Booking dates are stored as UTC midnight; always format them in UTC. */
export function formatDay(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
