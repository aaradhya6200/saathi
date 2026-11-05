import type { Metadata, Viewport } from "next";
import { Baloo_2, Hind } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Hind({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Saathi · A trusted helper by the hour", template: "%s · Saathi" },
  description:
    "Book a verified helper by the hour for hospital visits, medicines, market runs and paperwork. Live updates for the whole family. Hyderabad.",
  applicationName: "Saathi",
  appleWebApp: { capable: true, title: "Saathi", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#15803D",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Catch Chrome's install offer as early as possible, before the app's scripts load */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__saathiInstall=e;window.dispatchEvent(new Event('saathi-install'));});",
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
