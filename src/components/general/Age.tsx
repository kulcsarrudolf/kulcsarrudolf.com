"use client";

import { useEffect, useState } from "react";
import { getMyAge } from "@/utils/getMyAge";

export default function Age() {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    setAge(getMyAge());
  }, []);

  return <span>{age ?? ""}</span>;
}
