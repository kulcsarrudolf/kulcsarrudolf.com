import type { ReactNode } from "react";

import Navbar from "@/components/navbar/Navbar";

interface PageShellProps {
  children: ReactNode;
}

/** The centred column every page sits in: the navbar, then the page in a card. */
const PageShell = ({ children }: PageShellProps) => (
  <div className="mx-auto max-w-5xl">
    <Navbar />
    <div className="border border-gray-300 p-4 rounded-xl shadow-md">
      {children}
    </div>
  </div>
);

export default PageShell;
