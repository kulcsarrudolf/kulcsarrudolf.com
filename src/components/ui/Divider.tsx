import type { ReactNode } from "react";

interface DividerProps {
  /** A word to sit in the middle of the rule, as in "or". */
  label?: ReactNode;
}

/**
 * A horizontal rule between sections of a page.
 *
 * With a label the rule breaks either side of the word rather than running
 * behind it, so the two halves stay visible without a background colour to
 * knock the text out of.
 */
const Divider = ({ label }: DividerProps) => {
  if (!label) {
    return <hr className="my-6" />;
  }

  return (
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-300" />
      <span className="px-4 text-gray-500 text-sm">{label}</span>
      <div className="flex-1 border-t border-gray-300" />
    </div>
  );
};

export default Divider;
