import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { InstallBanner, ServiceWorker } from "@/components/InstallApp";
import "./site.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="nav" aria-label="Main">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="Saathi home">
            <LogoMark /> Saathi
          </Link>
          <ul>
            <li><Link href="/#how">How it works</Link></li>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/#safety">Safety</Link></li>
            <li><Link href="/join">Become a helper</Link></li>
            <li><Link href="/track">Track a booking</Link></li>
          </ul>
          <Link className="nav-app" href="/app">Get app</Link>
          <Link className="btn primary" href="/book">Book a Saathi</Link>
        </div>
      </nav>
      {children}
      <InstallBanner />
      <ServiceWorker />
      {/* Bottom tabs, shown only when opened as the installed app */}
      <nav className="app-tabs" aria-label="App">
        <Link href="/">Home</Link>
        <Link href="/book">Book</Link>
        <Link href="/track">Track</Link>
      </nav>
      <footer className="site-footer">
        <div className="wrap">
          <div>
            <Link className="logo" href="/" style={{ fontSize: "1.3rem" }}>Saathi</Link>
            <p style={{ marginTop: ".4rem" }}>A trusted helper you book by the hour. Hyderabad.</p>
          </div>
          <nav aria-label="Footer">
            <Link href="/book">Book</Link>
            <Link href="/track">Track a booking</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/join">Become a helper</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/app">Get the app</Link>
          </nav>
          <p>© {new Date().getFullYear()} Saathi</p>
        </div>
      </footer>
    </>
  );
}
