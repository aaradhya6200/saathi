import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { STATUSES, STATUS_LABEL, type Status } from "@/lib/booking";
import { estimate, formatDay, inr, PLANS, type PlanId } from "@/lib/pricing";
import { addUpdate, assignHelper, completeBooking, saveNotes, setBookingStatus, setPaid } from "../../../actions";

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await db.booking.findUnique({
    where: { id },
    include: { helper: true, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!b) notFound();
  const helpers = await db.helper.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } });
  const plan = b.plan as PlanId;
  const status = b.status as Status;
  const open = status !== "COMPLETED" && status !== "CANCELLED";

  return (
    <>
      <div className="admin-head">
        <div>
          <Link href="/admin/bookings" className="muted">← Bookings</Link>
          <h1 className="num">{b.code}</h1>
        </div>
        <span className={`status s-${status}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="detail">
        <div style={{ display: "grid", gap: "1.2rem" }}>
          <section className="panel">
            <h2>Request</h2>
            <dl className="kv">
              <dt>Customer</dt><dd>{b.customerName} · <a href={`tel:+91${b.customerPhone}`}>{b.customerPhone}</a> · <a href={`https://wa.me/91${b.customerPhone}`} target="_blank" rel="noopener">WhatsApp</a></dd>
              <dt>For</dt><dd>{b.forWhom}</dd>
              <dt>Area</dt><dd>{b.area}, {b.city}</dd>
              <dt>When</dt><dd>{formatDay(b.date)} at {b.startTime}, {b.hours} hours</dd>
              <dt>Plan</dt><dd>{PLANS[plan].label} · est. {plan === "CARE" ? "covered by plan" : inr(estimate(plan, b.hours))}</dd>
              <dt>Tasks</dt><dd>{b.tasks}</dd>
              <dt>Received</dt><dd>{b.createdAt.toLocaleString("en-IN")}</dd>
            </dl>
          </section>

          <section className="panel">
            <h2>Updates the family sees</h2>
            {open && (
              <form className="inline" action={addUpdate.bind(null, b.id)}>
                <input name="message" placeholder="e.g. Medicines bought, ₹1,240, bill photo sent on WhatsApp" aria-label="New update" required maxLength={500} />
                <button className="btn primary small" type="submit">Post update</button>
              </form>
            )}
            <ol className="timeline" style={{ listStyle: "none", margin: 0, paddingLeft: "1rem", borderLeft: "2px solid var(--line)", display: "grid", gap: ".7rem" }}>
              {b.events.map((e) => (
                <li key={e.id}>
                  <span className="muted" style={{ fontSize: ".82rem", display: "block" }}>{e.createdAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
                  {e.message}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div style={{ display: "grid", gap: "1.2rem" }}>
          <section className="panel">
            <h2>Helper</h2>
            {helpers.length === 0 ? (
              <p className="muted">No active helpers yet. Mark an applicant as Active on the <Link href="/admin/helpers">Helpers</Link> page first.</p>
            ) : (
              <form className="inline" action={assignHelper.bind(null, b.id)}>
                <select name="helperId" defaultValue={b.helperId ?? ""} aria-label="Assign helper">
                  <option value="">Not assigned</option>
                  {helpers.map((h) => <option key={h.id} value={h.id}>{h.name} · {h.area}{h.verified ? " ✓" : ""}</option>)}
                </select>
                <button className="btn ghost small" type="submit">Save</button>
              </form>
            )}
            {b.helper && <p className="muted">{b.helper.name} · <a href={`tel:+91${b.helper.phone}`}>{b.helper.phone}</a></p>}
          </section>

          <section className="panel">
            <h2>Status</h2>
            {open ? (
              <form className="inline" action={setBookingStatus.bind(null, b.id)}>
                <select name="status" defaultValue={status} aria-label="Status">
                  {STATUSES.filter((s) => s !== "COMPLETED").map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
                <button className="btn ghost small" type="submit">Update</button>
              </form>
            ) : (
              <p className="muted">This booking is {STATUS_LABEL[status].toLowerCase()}.</p>
            )}
          </section>

          <section className="panel">
            <h2>Bill</h2>
            {status === "COMPLETED" && b.minutesUsed != null ? (
              <>
                <dl className="kv num">
                  <dt>Time used</dt><dd>{Math.floor(b.minutesUsed / 60)} h {b.minutesUsed % 60} m</dd>
                  <dt>Time charge</dt><dd>{inr(b.timeCharge ?? 0)}</dd>
                  <dt>Purchases</dt><dd>{inr(b.purchases ?? 0)}</dd>
                  <dt>Total</dt><dd><b>{inr((b.timeCharge ?? 0) + (b.purchases ?? 0))}</b></dd>
                </dl>
                <form action={setPaid.bind(null, b.id)}>
                  <input type="hidden" name="paid" value={b.paid ? "0" : "1"} />
                  <button className={`btn small ${b.paid ? "ghost" : "primary"}`} type="submit">{b.paid ? "Paid ✓ · Mark unpaid" : "Mark as paid"}</button>
                </form>
              </>
            ) : open ? (
              <form action={completeBooking.bind(null, b.id)} style={{ display: "grid", gap: ".6rem" }}>
                <p className="muted" style={{ fontSize: ".92rem" }}>Enter the time used to finish the booking. 2-hour minimum, then 15-minute steps.</p>
                <div className="inline">
                  <div className="f"><label htmlFor="hoursUsed">Hours</label><input id="hoursUsed" name="hoursUsed" type="number" min={0} max={12} defaultValue={Math.floor(b.hours)} required /></div>
                  <div className="f"><label htmlFor="minsUsed">Minutes</label><input id="minsUsed" name="minsUsed" type="number" min={0} max={59} step={5} defaultValue={Math.round((b.hours % 1) * 60)} /></div>
                  <div className="f"><label htmlFor="purchases">Purchases ₹</label><input id="purchases" name="purchases" type="number" min={0} defaultValue={0} /></div>
                </div>
                <button className="btn primary small" type="submit">Complete booking</button>
              </form>
            ) : (
              <p className="muted">No bill for a cancelled booking.</p>
            )}
          </section>

          <section className="panel">
            <h2>Private notes</h2>
            <form action={saveNotes.bind(null, b.id)} style={{ display: "grid", gap: ".6rem" }}>
              <textarea name="notes" defaultValue={b.adminNotes ?? ""} aria-label="Private notes" placeholder="Only the team sees these." />
              <button className="btn ghost small" type="submit" style={{ justifySelf: "start" }}>Save notes</button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
