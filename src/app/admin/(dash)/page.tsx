import Link from "next/link";
import { db } from "@/lib/db";
import { STATUS_LABEL, type Status } from "@/lib/booking";
import { formatDay, inr } from "@/lib/pricing";

export default async function Overview() {
  const today = new Date(new Date().toLocaleDateString("en-CA") + "T00:00:00Z");
  const weekAhead = new Date(today.getTime() + 7 * 864e5);
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));

  const [byStatus, upcoming, newHelpers, activeHelpers, monthDone] = await Promise.all([
    db.booking.groupBy({ by: ["status"], _count: true }),
    db.booking.findMany({
      where: { date: { gte: today, lt: weekAhead }, status: { in: ["REQUESTED", "CONFIRMED", "IN_PROGRESS"] } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      include: { helper: true },
      take: 20,
    }),
    db.helper.count({ where: { status: "APPLIED" } }),
    db.helper.count({ where: { status: "ACTIVE" } }),
    db.booking.findMany({ where: { status: "COMPLETED", date: { gte: monthStart } }, select: { timeCharge: true, minutesUsed: true } }),
  ]);
  const count = (s: Status) => byStatus.find((r) => r.status === s)?._count ?? 0;
  const revenue = monthDone.reduce((a, b) => a + (b.timeCharge ?? 0), 0);
  const hours = monthDone.reduce((a, b) => a + (b.minutesUsed ?? 0), 0) / 60;

  return (
    <>
      <div className="admin-head"><h1>Overview</h1></div>
      <div className="stats">
        <Link className="stat" href="/admin/bookings?status=REQUESTED"><b>{count("REQUESTED")}</b><span>New requests to confirm</span></Link>
        <Link className="stat" href="/admin/bookings?status=CONFIRMED"><b>{count("CONFIRMED")}</b><span>Confirmed, upcoming</span></Link>
        <Link className="stat" href="/admin/bookings?status=IN_PROGRESS"><b>{count("IN_PROGRESS")}</b><span>In progress now</span></Link>
        <Link className="stat" href="/admin/helpers?status=APPLIED"><b>{newHelpers}</b><span>Helper applications</span></Link>
        <Link className="stat" href="/admin/helpers?status=ACTIVE"><b>{activeHelpers}</b><span>Active helpers</span></Link>
        <div className="stat"><b>{inr(revenue)}</b><span>Time revenue this month · {hours.toFixed(1)} h</span></div>
      </div>

      <h2 style={{ fontSize: "1.3rem" }}>Next 7 days</h2>
      <div className="tbl">
        {upcoming.length === 0 ? (
          <p className="empty">No open bookings in the next 7 days. New requests from the website appear here.</p>
        ) : (
          <table>
            <thead><tr><th>When</th><th>Booking</th><th>Area</th><th>Helper</th><th>Status</th></tr></thead>
            <tbody>
              {upcoming.map((b) => (
                <tr key={b.id}>
                  <td className="num">{formatDay(b.date)}<br /><span className="muted">{b.startTime} · {b.hours} h</span></td>
                  <td><Link href={`/admin/bookings/${b.id}`}>{b.code}</Link><br /><span className="muted">{b.forWhom}</span></td>
                  <td>{b.area}</td>
                  <td>{b.helper?.name ?? <span className="err">Not assigned</span>}</td>
                  <td><span className={`status s-${b.status}`}>{STATUS_LABEL[b.status as Status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
