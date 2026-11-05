"use client";

import { useState } from "react";
import { postJson } from "@/lib/postJson";

export function HelperForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    languages: "",
    hasBike: false,
    availability: "Mornings",
    about: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await postJson("/api/helpers", form);
    setBusy(false);
    if (res.ok) {
      setSent(true);
      window.scrollTo({ top: 0 });
    } else {
      setErrors(res.errors);
      setError(res.error ?? (Object.keys(res.errors).length ? "Please fix the highlighted fields." : "Something went wrong."));
      const first = Object.keys(res.errors)[0];
      if (first) document.getElementById(first)?.focus();
    }
  }

  if (sent) {
    return (
      <div className="formcard success" role="status">
        <h3>Application received</h3>
        <p>Thank you, {form.name.split(" ")[0]}. We’ll call you on {form.phone} within a few days to set up an interview.</p>
        <p className="muted">Bring a government ID and address proof to the interview. Police verification and training are free.</p>
      </div>
    );
  }

  const field = (k: string) => ({ id: k, "aria-invalid": errors[k] ? true : undefined });
  const err = (k: string) => (errors[k] ? <span className="err">{errors[k]}</span> : null);

  return (
    <form className="formcard form" onSubmit={submit} noValidate>
      <div className="f"><label htmlFor="name">Full name</label><input {...field("name")} autoComplete="name" value={form.name} onChange={set("name")} />{err("name")}</div>
      <div className="f"><label htmlFor="phone">Phone number</label><input {...field("phone")} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />{err("phone")}</div>
      <div className="f"><label htmlFor="area">Area you live in</label><input {...field("area")} value={form.area} onChange={set("area")} placeholder="Ameerpet" />{err("area")}</div>
      <div className="f"><label htmlFor="languages">Languages you speak</label><input id="languages" value={form.languages} onChange={set("languages")} placeholder="Telugu, Hindi, English" /></div>
      <div className="f">
        <label htmlFor="availability">When can you work?</label>
        <select id="availability" value={form.availability} onChange={set("availability")}>
          {["Mornings", "Afternoons", "Full day", "Weekends only"].map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="f" style={{ alignContent: "end" }}>
        <label className="check"><input type="checkbox" id="hasBike" checked={form.hasBike} onChange={(e) => setForm({ ...form, hasBike: e.target.checked })} /> I have a two-wheeler and licence</label>
      </div>
      <div className="f full"><label htmlFor="about">Tell us about yourself</label><textarea id="about" value={form.about} onChange={set("about")} placeholder="Past work, experience helping elderly people, anything else." /></div>
      <div className="hp" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></div>
      {error && <p className="notice full" role="alert">{error}</p>}
      <div className="formfoot full">
        <span className="hint">Police verification and training are free.</span>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Sending…" : "Send application"}</button>
      </div>
    </form>
  );
}
