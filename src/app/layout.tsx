import type { Metadata } from "next";
import { Baloo_2, Hind } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Hind({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Saathi · A trusted helper by the hour", template: "%s · Saathi" },
  description:
    "Book a verified helper by the hour for hospital visits, medicines, market runs and paperwork. Live updates for the whole family. Hyderabad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
