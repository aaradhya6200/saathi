import type { Metadata } from "next";
import { HelperForm } from "@/components/HelperForm";
import { HELPER_RATE, inr } from "@/lib/pricing";

export const metadata: Metadata = { title: "Become a helper" };

export default function JoinPage() {
  return (
    <main className="page">
      <div className="wrap page-grid">
        <div className="aside">
          <div className="head" style={{ margin: 0 }}>
            <span className="eyebrow">Become a helper</span>
            <h1>Work as a Saathi</h1>
            <p className="lead">Help families in your neighbourhood and earn {inr(HELPER_RATE)} an hour for all booked time.</p>
          </div>
          <div className="card"><h3>1. Apply</h3><p>Fill in this form. It takes two minutes.</p></div>
          <div className="card"><h3>2. Interview and verification</h3><p>Meet us in person. We arrange police verification for free.</p></div>
          <div className="card"><h3>3. Training, then bookings</h3><p>A short training on helping elderly people and handling cash, then your first bookings.</p></div>
        </div>
        <HelperForm />
      </div>
    </main>
  );
}
