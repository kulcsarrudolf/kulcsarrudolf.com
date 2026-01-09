import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Quote from "@/components/quote/Quote";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { Suspense } from "react";
import ConditionalSpeedInsights from "@/components/general/SpeedInsights";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Kulcsar Rudolf - Software Developer",
  description:
    "Welcome to my personal website! I'm Kulcsar Rudolf, a passionate software developer, and this is where I showcase my work, share my thoughts, and document my journey in the world of technology. Explore my portfolio, read my blog posts, and discover the projects I've been working on. Join me as I delve into the exciting realm of software development and share my insights, experiences, and learnings. Let's connect and explore the endless possibilities of coding together!",
  keywords: [
    "software developer",
    "portfolio",
    "blog",
    "technology",
    "coding",
    "react",
    "typescript",
    "nextjs",
    "nodejs",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`p-2 ${inter.variable}`}
      style={{
        backgroundColor: "#E9EBEE",
      }}
    >
      <body suppressHydrationWarning style={{ marginTop: "7rem" }}>
        <div className="mx-auto max-w-5xl">
          <Suspense fallback={<div style={{ height: "7rem" }} />}>
            <Navbar />
          </Suspense>
          <div className="border border-gray-300 p-4 rounded-xl shadow-md">
            {children}
          </div>

          {/* <Quote /> disable for now */}
        </div>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <ConditionalSpeedInsights />
      </body>
    </html>
  );
}
