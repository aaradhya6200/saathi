import { ImageResponse } from "next/og";
import { AppIconArt } from "@/components/AppIconArt";

const SIZES = [192, 512];
export const dynamic = "force-static";
export function generateStaticParams() {
  return SIZES.map((s) => ({ size: String(s) }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const n = Number((await params).size);
  const size = SIZES.includes(n) ? n : 512;
  return new ImageResponse(<AppIconArt size={size} />, { width: size, height: size });
}
