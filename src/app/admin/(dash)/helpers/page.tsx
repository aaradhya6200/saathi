import Link from "next/link";
import { db } from "@/lib/db";
import { HELPER_STATUSES, type HelperStatus } from "@/lib/booking";
import { setHelperStatus, setHelperVerified } from "../../actions";

const LABEL: Record<HelperStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  ACTIVE: "Active",
  REJECTED: "Rejected",
};

export default async function Helpers({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = HELPER_STATUSES.includes(status as HelperStatus);
  const helpers = await db.helper.findMany({
    where: valid ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: { where: { status: "COMPLETED" } } } } },
  });

  return (
    <>
      <div className="admin-head"><h1>Helpers</h1></div>
      <nav className="tabs" aria-label="Filter by status">
        <Link href="/admin/helpers" aria-current={!valid ? "page" : undefined}>All</Link>
        {HELPER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/helpers?status=${s}`} aria-current={status === s ? "page" : undefined}>{LABEL[s]}</Link>
        ))}
      </nav>
      <div className="tbl">
        {helpers.length === 0 ? (
          <p className="empty">No helpers {valid ? "with this status" : "yet. Applications from the website’s Become a helper page appear here"}.</p>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Area</th><th>Details</th><th>Done</th><th>Verified</th><th>Status</th></tr></thead>
            <tbody>
              {helpers.map((h) => (
                <tr key={h.id}>
                  <td><b>{h.name}</b><br /><a className="muted num" href={`tel:+91${h.phone}`}>{h.phone}</a></td>
                  <td>{h.area}</td>
                  <td style={{ maxWidth: 320 }}>
                    {h.availability} · {h.hasBike ? "Has two-wheeler" : "No two-wheeler"}
                    {h.languages && <><br /><span className="muted">{h.languages}</span></>}
                    {h.about && <><br /><span className="muted">{h.about}</span></>}
                    <br /><span className="muted">Applied {h.createdAt.toLocaleDateString("en-IN")}</span>
                  </td>
                  <td className="num">{h._count.bookings}</td>
                  <td>
                    <form action={setHelperVerified.bind(null, h.id)}>
                      <input type="hidden" name="verified" value={h.verified ? "0" : "1"} />
                      <button className="btn ghost small" type="submit" title="Police verification">{h.verified ? "✓ Verified" : "Mark verified"}</button>
                    </form>
                  </td>
                  <td>
                    <form className="inline" action={setHelperStatus.bind(null, h.id)} style={{ flexWrap: "nowrap" }}>
                      <select name="status" defaultValue={h.status} aria-label={`Status for ${h.name}`}>
                        {HELPER_STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                      </select>
                      <button className="btn ghost small" type="submit">Save</button>
                    </form>
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
