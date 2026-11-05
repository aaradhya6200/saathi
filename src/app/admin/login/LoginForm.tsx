"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { LogoMark } from "@/components/Logo";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form className="formcard" action={action}>
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        <LogoMark size={34} />
        <h1 style={{ fontSize: "1.6rem" }}>Saathi admin</h1>
      </div>
      <div className="f">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      {state?.error && <p className="notice" role="alert">{state.error}</p>}
      <button className="btn primary" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
