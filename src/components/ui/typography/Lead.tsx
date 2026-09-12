import type { ReactNode } from "react";

interface LeadProps {
  children: ReactNode;
}

/** The muted sentence under a page title, before the content proper. */
const Lead = ({ children }: LeadProps) => (
  <p className="text-gray-600 mb-6 dark:text-gray-400">{children}</p>
);

export default Lead;
