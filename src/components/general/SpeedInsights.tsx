"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export default function ConditionalSpeedInsights() {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsProduction(hostname === "kulcsarrudolf.com");
    }
  }, []);

  if (!isProduction) {
    return null;
  }

  return <SpeedInsights />;
}

