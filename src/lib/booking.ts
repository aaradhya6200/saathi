export const STATUSES = ["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const HELPER_STATUSES = ["APPLIED", "INTERVIEW", "ACTIVE", "REJECTED"] as const;
export type HelperStatus = (typeof HELPER_STATUSES)[number];

export function maskPhone(p: string): string {
  return p.slice(0, 2) + "••••••" + p.slice(-2);
}
