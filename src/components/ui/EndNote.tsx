import type { ReactNode } from "react";

interface EndNoteProps {
  children: ReactNode;
  /** Centres the content, as under the project list. */
  centered?: boolean;
}

/**
 * The closing block under a page's main content: room, a hairline rule, then a
 * parting note or a link back.
 */
const EndNote = ({ children, centered = false }: EndNoteProps) => (
  <div
    className={`mt-8 pt-6 border-t border-gray-200 dark:border-line-dark ${centered ? "text-center" : ""}`.trim()}
  >
    {children}
  </div>
);

export default EndNote;
