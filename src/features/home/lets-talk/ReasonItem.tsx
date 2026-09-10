import type { ReactNode } from "react";

interface ReasonItemProps {
  icon: ReactNode;
  /** The two or three word handle the sentence does not have on its own. */
  label: string;
  children: ReactNode;
}

/**
 * One case inside the Let's Talk band. Everything here is white on brand blue,
 * and the opacities are the floor rather than a taste call: white text only
 * clears AA on `brand` above about 90%, so the sentence sits at 90 and the
 * hierarchy comes from size and weight instead.
 */
const ReasonItem = ({ icon, label, children }: ReasonItemProps) => (
  <div className="flex items-start gap-3.5 border-t border-white/20 py-3.5">
    <span className="mt-0.5 shrink-0 text-white/80">{icon}</span>
    <span>
      <span className="mb-0.5 block text-sm font-semibold text-white">{label}</span>
      <span className="block text-sm leading-[1.55] text-white/90" style={{ textWrap: "pretty" }}>
        {children}
      </span>
    </span>
  </div>
);

export default ReasonItem;
