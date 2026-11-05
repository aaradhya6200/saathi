import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PLAN_IDS, type PlanId } from "@/lib/pricing";

export const metadata: Metadata = { title: "Book a Saathi" };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initialPlan: PlanId = PLAN_IDS.includes(plan as PlanId) ? (plan as PlanId) : "PAYG";

  return (
    <main className="page">
      <div className="wrap page-grid">
        <div className="aside">
          <div className="head" style={{ margin: 0 }}>
            <span className="eyebrow">Book</span>
            <h1>Book a Saathi</h1>
            <p className="lead">Tell us what needs doing. We confirm your helper and time on WhatsApp.</p>
          </div>
          <div className="card"><h3>What happens next</h3><p>We call or message you to confirm the tasks, then share your Saathi’s name before they arrive.</p></div>
          <div className="card"><h3>How you pay</h3><p>At the end, by UPI: time used plus purchases at the exact bill amount.</p></div>
          <div className="card"><h3>Cancelling</h3><p>Free up to 2 hours before the start time.</p></div>
        </div>
        <BookingForm initialPlan={initialPlan} />
      </div>
    </main>
  );
}
