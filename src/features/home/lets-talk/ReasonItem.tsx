import type { ReactNode } from "react";

interface ReasonItemProps {
  icon: ReactNode;
  children: ReactNode;
}

/**
 * One case inside the Let's Talk band: an icon centred against its sentence.
 * Everything here is white on brand blue, and the opacities are the floor
 * rather than a taste call: white text only clears AA on `brand` above about
 * 90%, so the sentence sits at 90 and the icon a step quieter at 80.
 */
const ReasonItem = ({ icon, children }: ReasonItemProps) => (
  <div className="flex items-center gap-4 border-t border-white/20 py-3.5">
    <span className="shrink-0 text-white/80">{icon}</span>
    <p className="text-sm leading-[1.55] text-white/90" style={{ textWrap: "pretty" }}>
      {children}
    </p>
  </div>
);

export default ReasonItem;
