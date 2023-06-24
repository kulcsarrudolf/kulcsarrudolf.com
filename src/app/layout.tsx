import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="p-2">
      <body className={inter.className}>
        <div className="mx-auto max-w-5xl">
          <Navbar />
          <div className="border border-black-500 p-4 rounded-xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
