import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Quote from "@/components/quote/Quote";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { Suspense } from "react";
import ConditionalSpeedInsights from "@/components/general/SpeedInsights";
import type { Metadata } from "next";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_NAME = "Kulcsar Rudolf - Software Developer";
const SITE_URL = "https://kulcsarrudolf.com";
const DEFAULT_DESCRIPTION =
  "Personal website of Kulcsar Rudolf, a full-stack software developer. Read articles about software development, explore side projects, and see the tools and ideas I work with every day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Kulcsar Rudolf",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Kulcsar Rudolf", url: SITE_URL }],
  creator: "Kulcsar Rudolf",
  publisher: "Kulcsar Rudolf",
  keywords: [
    "Kulcsar Rudolf",
    "software developer",
    "full-stack developer",
    "portfolio",
    "blog",
    "technology",
    "coding",
    "react",
    "typescript",
    "nextjs",
    "nodejs",
    "ai agents",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/images/me-logo.png",
        width: 512,
        height: 512,
        alt: "Kulcsar Rudolf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    creator: "@kulcsarrudolf",
    images: ["/images/me-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
