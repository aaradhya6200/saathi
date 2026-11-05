import type { Metadata } from "next";
import { InstallPanel } from "@/components/InstallApp";

export const metadata: Metadata = {
  title: "Get the app",
  description: "Install the Saathi app on your phone: book a helper and track visits from your home screen.",
};

export default function AppPage() {
  return (
    <main className="band app-page">
      <div className="wrap narrow">
        <img className="app-page-icon" src="/app-icon/192" alt="Saathi app icon" width={88} height={88} />
        <h1>Get the Saathi app</h1>
        <p className="lead">
          Book a helper and follow the visit from your home screen. Free, no app store needed, and it is
          always up to date.
        </p>
        <InstallPanel />
      </div>
    </main>
  );
}
