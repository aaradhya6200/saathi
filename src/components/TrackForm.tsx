"use client";

import { useState } from "react";
import { postJson } from "@/lib/postJson";
import { STATUS_LABEL, type Status } from "@/lib/booking";
import { formatDay, inr, PLANS, type PlanId } from "@/lib/pricing";

type Tracked = {
  code: string;
  status: Status;
  forWhom: string;
  area: string;
  date: string;
  startTime: string;
  hours: number;
  plan: PlanId;
  tasks: string;
  helper: { name: string; verified: boolean } | null;
  bill: { minutesUsed: number; timeCharge: number; purchases: number; paid: boolean } | null;
  events: { at: string; message: string }[];
};

export function TrackForm({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [b, setB] = useState<Tracked | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setErrors({});
    const res = await postJson<Tracked>("/api/track", { code, phone });
    setBusy(false);
    if (res.ok) setB(res.data);
    else {
      setB(null);
      setErrors(res.errors);
      setError(res.error ?? "");
    }
  }

  return (
    <div>
      <form className="formcard form" onSubmit={submit} noValidate>
        <div className="f">
          <label htmlFor="code">Booking code</label>
          <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SA-7K3P9" aria-invalid={errors.code ? true : undefined} />
          {errors.code && <span className="err">{errors.code}</span>}
        </div>
        <div className="f">
          <label htmlFor="phone">Phone number used to book</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={errors.phone ? true : undefined} />
          {errors.phone && <span className="err">{errors.phone}</span>}
        </div>
        {error && <p className="notice full" role="alert">{error}</p>}
        <div className="formfoot full">
          <span className="hint">The code is in your booking confirmation.</span>
          <button className="btn primary" type="submit" disabled={busy}>{busy ? "Checking…" : b ? "Refresh" : "Check status"}</button>
        </div>
      </form>

      {b && (
        <div className="formcard track-result" aria-live="polite">
          <div className="track-head">
            <div className="code">{b.code}</div>
            <span className={`status s-${b.status}`}>{STATUS_LABEL[b.status]}</span>
          </div>
          <dl className="kv">
            <dt>For</dt><dd>{b.forWhom}, {b.area}</dd>
            <dt>When</dt><dd>{formatDay(b.date)} at {b.startTime}, {b.hours} hours</dd>
            <dt>Plan</dt><dd>{PLANS[b.plan].label}</dd>
            <dt>Helper</dt><dd>{b.helper ? `${b.helper.name}${b.helper.verified ? " · police verified" : ""}` : "Being assigned"}</dd>
            <dt>Tasks</dt><dd>{b.tasks}</dd>
            {b.bill && (
              <>
                <dt>Time used</dt><dd>{Math.floor(b.bill.minutesUsed / 60)} h {b.bill.minutesUsed % 60} m · {inr(b.bill.timeCharge)}</dd>
                <dt>Purchases</dt><dd>{inr(b.bill.purchases)} at cost</dd>
                <dt>Total</dt><dd><b>{inr(b.bill.timeCharge + b.bill.purchases)}</b> · {b.bill.paid ? "Paid" : "Payment due"}</dd>
              </>
            )}
          </dl>
          <div>
            <h3 style={{ marginBottom: ".6rem" }}>Updates</h3>
            <ol className="timeline">
              {b.events.map((ev) => (
                <li key={ev.at + ev.message}>
                  <time>{new Date(ev.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</time>
                  {ev.message}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
