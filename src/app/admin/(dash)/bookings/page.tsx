import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { STATUSES, STATUS_LABEL, type Status } from "@/lib/booking";
import { estimate, formatDay, inr, PLANS, type PlanId } from "@/lib/pricing";

export default async function Bookings({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const where: Prisma.BookingWhereInput = {};
  if (status && STATUSES.includes(status as Status)) where.status = status;
  if (q?.trim()) {
    const term = q.trim();
    where.OR = [
      { code: { contains: term.toUpperCase() } },
      { customerName: { contains: term, mode: "insensitive" } },
      { customerPhone: { contains: term.replace(/\D/g, "") || term } },
      { area: { contains: term, mode: "insensitive" } },
    ];
  }
  const bookings = await db.booking.findMany({ where, orderBy: { createdAt: "desc" }, include: { helper: true }, take: 200 });

  const tab = (s?: string) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return "/admin/bookings" + (qs ? "?" + qs : "");
  };

  return (
    <>
      <div className="admin-head">
        <h1>Bookings</h1>
        <form className="search" action="/admin/bookings">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Code, name, phone or area" aria-label="Search bookings" />
          <button className="btn ghost small" type="submit">Search</button>
        </form>
      </div>
      <nav className="tabs" aria-label="Filter by status">
        <Link href={tab()} aria-current={!status ? "page" : undefined}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={tab(s)} aria-current={status === s ? "page" : undefined}>{STATUS_LABEL[s]}</Link>
        ))}
      </nav>
      <div className="tbl">
        {bookings.length === 0 ? (
          <p className="empty">No bookings {status || q ? "match this filter" : "yet. Requests from the website’s Book page appear here"}.</p>
        ) : (
          <table>
            <thead><tr><th>Booking</th><th>Customer</th><th>When</th><th>Plan</th><th>Helper</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td><Link href={`/admin/bookings/${b.id}`}>{b.code}</Link><br /><span className="muted">{b.area}</span></td>
                  <td>{b.customerName}<br /><span className="muted num">{b.customerPhone}</span></td>
                  <td className="num">{formatDay(b.date)}<br /><span className="muted">{b.startTime} · {b.hours} h</span></td>
                  <td>{PLANS[b.plan as PlanId].label}</td>
                  <td>{b.helper?.name ?? <span className="muted">—</span>}</td>
                  <td><span className={`status s-${b.status}`}>{STATUS_LABEL[b.status as Status]}</span></td>
                  <td className="num">
                    {b.timeCharge != null
                      ? <>{inr(b.timeCharge + (b.purchases ?? 0))}<br /><span className="muted">{b.paid ? "Paid" : "Unpaid"}</span></>
                      : <span className="muted">est. {inr(estimate(b.plan as PlanId, b.hours))}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
