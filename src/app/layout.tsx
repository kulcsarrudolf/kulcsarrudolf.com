import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Quote from "@/components/quote/Quote";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";

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
          <Navbar />
          <Quote />
          <div className="border border-gray-300 p-4 rounded-xl shadow-md">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
