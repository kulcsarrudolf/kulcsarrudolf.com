"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function ConditionalSpeedInsights() {
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

  if (!isProduction) {
    return null;
  }

  return <SpeedInsights />;
}
