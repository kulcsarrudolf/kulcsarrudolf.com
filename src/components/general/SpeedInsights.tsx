"use client";

import { Analytics } from "@vercel/analytics/next";

export default function ConditionalSpeedInsights() {
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

  if (!isProduction) {
    return null;
  }

  return <Analytics />;
}
