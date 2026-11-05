import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = { title: "Track a booking" };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return (
    <main className="page">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="head">
          <span className="eyebrow">Track</span>
          <h1>Track a booking</h1>
          <p className="lead">See the status, your helper and every update. Share the code with family so they can follow along too.</p>
        </div>
        <TrackForm initialCode={(code ?? "").toUpperCase()} />
      </div>
    </main>
  );
}
