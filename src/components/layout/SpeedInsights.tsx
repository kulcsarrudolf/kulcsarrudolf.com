import { Analytics } from "@vercel/analytics/react";

export default function ConditionalSpeedInsights() {
  const isProduction = import.meta.env.VITE_ENV === "production";

  if (!isProduction) {
    return null;
  }

  return <Analytics />;
}
