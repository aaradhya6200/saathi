"use client";

import Link from "next/link";
import { useState } from "react";
import { estimate, inr, PLANS, PLAN_IDS, type PlanId } from "@/lib/pricing";
import { postJson } from "@/lib/postJson";

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

export function BookingForm({ initialPlan }: { initialPlan: PlanId }) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    forWhom: "",
    area: "",
    plan: initialPlan,
    hours: "3",
    date: tomorrow(),
    startTime: "10:00",
    tasks: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const plan = form.plan as PlanId;
  const est = plan === "CARE" ? `${inr(PLANS.CARE.rate)}/month` : inr(estimate(plan, +form.hours));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await postJson<{ code: string }>("/api/bookings", form);
    setBusy(false);
    if (res.ok) {
      setCode(res.data.code);
      window.scrollTo({ top: 0 });
    } else {
      setErrors(res.errors);
      setError(res.error ?? (Object.keys(res.errors).length ? "Please fix the highlighted fields." : "Something went wrong."));
      const first = Object.keys(res.errors)[0];
      if (first) document.getElementById(first)?.focus();
    }
  }

  if (code) {
    return (
      <div className="formcard success" role="status">
        <h3>Booking request received</h3>
        <p>Your booking code is</p>
        <div className="code">{code}</div>
        <p className="muted">
          Save this code. We’ll call or WhatsApp you on {form.customerPhone} to confirm your helper and time. You can check
          the status anytime with this code and your phone number.
        </p>
        <div className="cta-row">
          <Link className="btn primary" href={`/track?code=${code}`}>Track this booking</Link>
          <button className="btn ghost" type="button" onClick={() => { setCode(null); setForm({ ...form, tasks: "" }); }}>
            Book another
          </button>
        </div>
      </div>
    );
  }

  const field = (k: string) => ({ id: k, "aria-invalid": errors[k] ? true : undefined });
  const err = (k: string) => (errors[k] ? <span className="err">{errors[k]}</span> : null);

  return (
    <form className="formcard form" onSubmit={submit} noValidate>
      <div className="f"><label htmlFor="customerName">Your name</label><input {...field("customerName")} autoComplete="name" value={form.customerName} onChange={set("customerName")} placeholder="Priya Rao" />{err("customerName")}</div>
      <div className="f"><label htmlFor="customerPhone">Your WhatsApp number</label><input {...field("customerPhone")} type="tel" autoComplete="tel" value={form.customerPhone} onChange={set("customerPhone")} placeholder="98765 43210" />{err("customerPhone")}</div>
      <div className="f"><label htmlFor="forWhom">Who is the help for?</label><input {...field("forWhom")} value={form.forWhom} onChange={set("forWhom")} placeholder="My mother, Lakshmi" />{err("forWhom")}</div>
      <div className="f"><label htmlFor="area">Area in Hyderabad</label><input {...field("area")} value={form.area} onChange={set("area")} placeholder="Kukatpally" />{err("area")}</div>
      <div className="f">
        <label htmlFor="plan">Plan</label>
        <select id="plan" value={form.plan} onChange={set("plan")}>
          {PLAN_IDS.map((p) => (
            <option key={p} value={p}>{PLANS[p].label} · {inr(PLANS[p].rate)}/{PLANS[p].unit}</option>
          ))}
        </select>
      </div>
      <div className="f">
        <label htmlFor="hours">Hours</label>
        <select id="hours" value={form.hours} onChange={set("hours")}>
          {[2, 2.5, 3, 4, 5, 6, 8].map((h) => <option key={h} value={h}>{h} hours</option>)}
        </select>
        {err("hours")}
      </div>
      <div className="f"><label htmlFor="date">Date</label><input {...field("date")} type="date" min={new Date().toLocaleDateString("en-CA")} value={form.date} onChange={set("date")} />{err("date")}</div>
      <div className="f"><label htmlFor="startTime">Start time</label><input {...field("startTime")} type="time" value={form.startTime} onChange={set("startTime")} />{err("startTime")}</div>
      <div className="f full">
        <label htmlFor="tasks">What needs doing?</label>
        <textarea {...field("tasks")} value={form.tasks} onChange={set("tasks")} placeholder="Pick up prescription from home, buy medicines, collect blood report from the hospital, buy vegetables." />
        <span className="hint">List the stops in any order. You can add more during the booking.</span>
        {err("tasks")}
      </div>
      <div className="hp" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></div>
      {error && <p className="notice full" role="alert">{error}</p>}
      <div className="formfoot full">
        <div><span className="muted">Estimate </span><b className="num" style={{ fontSize: "1.4rem" }}>{est}</b><span className="muted"> + purchases at cost</span></div>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send booking request"}</button>
      </div>
    </form>
  );
}
