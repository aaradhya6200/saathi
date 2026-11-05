import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { logout } from "../actions";
import "../admin.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link className="logo" href="/admin"><LogoMark size={26} /> Saathi</Link>
        <nav aria-label="Admin">
          <Link href="/admin">Overview</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/helpers">Helpers</Link>
          <Link href="/" target="_blank">View site ↗</Link>
        </nav>
        <form action={logout}>
          <button className="btn ghost small" type="submit">Sign out</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
