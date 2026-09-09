import type { ReactNode } from "react";

interface CardGridProps {
  children: ReactNode;
}

/**
 * The two-column card layout behind /projects and /quotes.
 *
 * The cards are bordered and carry a shadow, so the gap has to be wide enough
 * for two shadows side by side to read as separate objects rather than one
 * soft edge. Two columns arrive at `sm`, where a tablet is already wide enough
 * to hold a pair without the type reflowing awkwardly.
 */
const CardGrid = ({ children }: CardGridProps) => (
  <div className="grid gap-6 sm:grid-cols-2">{children}</div>
);

export default CardGrid;
