"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-great-vibes",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const WEDDING_DATE = new Date(2026, 10, 28, 10, 0, 0);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getTimeLeft = (): TimeLeft | null => {
  const diff = WEDDING_DATE.getTime() - Date.now();

  if (diff <= 0) {
    return null;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
};

const FLOATING_HEARTS = [
  { left: "8%", size: "1.4rem", duration: "11s", delay: "0s" },
  { left: "22%", size: "1rem", duration: "14s", delay: "3s" },
  { left: "38%", size: "1.8rem", duration: "12s", delay: "6s" },
  { left: "55%", size: "1.1rem", duration: "15s", delay: "1s" },
  { left: "72%", size: "1.5rem", duration: "13s", delay: "4.5s" },
  { left: "88%", size: "1.2rem", duration: "16s", delay: "7s" },
];

const CountdownTile = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/60 px-1 py-4 shadow-lg shadow-rose-900/5 backdrop-blur-sm sm:px-4 sm:py-6">
    <span
      className="text-4xl font-semibold tabular-nums text-[#6d2237] sm:text-6xl"
      style={{ fontFamily: "var(--font-cormorant), serif" }}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8a5a63] sm:text-xs">
      {label}
    </span>
  </div>
);

const WeddingCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    // The image may fail before hydration, so onError alone is not enough.
    const photo = photoRef.current;
    if (photo && photo.complete && photo.naturalWidth === 0) {
      setPhotoOk(false);
    }

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isWeddingDay = mounted && timeLeft === null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#fbf7f1] via-[#f7ece3] to-[#efdcd2] ${greatVibes.variable} ${cormorant.variable}`}
    >
      <style>
        {`
          @keyframes nr-float {
            0% { transform: translateY(105vh) scale(0.9); opacity: 0; }
            12% { opacity: 0.5; }
            85% { opacity: 0.35; }
            100% { transform: translateY(-12vh) scale(1.15); opacity: 0; }
          }
        `}
      </style>

      <div aria-hidden className="pointer-events-none fixed inset-0">
        {FLOATING_HEARTS.map((heart, index) => (
          <span
            key={index}
            className="absolute text-rose-300/50"
            style={{
              left: heart.left,
              bottom: "-3rem",
              fontSize: heart.size,
              animation: `nr-float ${heart.duration} linear ${heart.delay} infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-14 text-center">
        <div className="rounded-full bg-gradient-to-br from-[#d9b87f] via-[#f0dfbe] to-[#c09a5e] p-1.5 shadow-xl shadow-rose-900/10">
          {photoOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={photoRef}
              src="/images/nr.jpg"
              alt="Nóra és Rudolf"
              className="h-44 w-44 rounded-full border-4 border-white object-cover object-top sm:h-60 sm:w-60"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-white bg-[#fdf9f4] text-4xl text-[#6d2237] sm:h-60 sm:w-60 sm:text-5xl"
              style={{ fontFamily: "var(--font-great-vibes), cursive" }}
            >
              N ♥ R
            </div>
          )}
        </div>

        <h1
          className="mt-8 text-5xl leading-tight text-[#6d2237] sm:text-7xl"
          style={{ fontFamily: "var(--font-great-vibes), cursive" }}
        >
          Nóra és Rudolf
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[0.45em] text-[#8a5a63] sm:text-base">
          menyegző
        </p>

        <div className="mt-6 flex items-center gap-3 text-[#c09a5e]">
          <span className="h-px w-12 bg-[#c09a5e]/60 sm:w-20" />
          <span className="text-lg">♥</span>
          <span className="h-px w-12 bg-[#c09a5e]/60 sm:w-20" />
        </div>

        <p
          className="mt-6 text-2xl text-[#4f2a33] sm:text-3xl"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          2026. november 28. · 10:00
        </p>

        {isWeddingDay ? (
          <p
            className="mt-10 text-3xl text-[#6d2237] sm:text-5xl"
            style={{ fontFamily: "var(--font-great-vibes), cursive" }}
          >
            Eljött a nagy nap! ♥
          </p>
        ) : (
          <div className="mt-10 grid w-full max-w-2xl grid-cols-4 gap-2 sm:gap-4">
            <CountdownTile value={timeLeft?.days ?? 0} label="nap" />
            <CountdownTile value={timeLeft?.hours ?? 0} label="óra" />
            <CountdownTile value={timeLeft?.minutes ?? 0} label="perc" />
            <CountdownTile value={timeLeft?.seconds ?? 0} label="mp" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingCountdown;
