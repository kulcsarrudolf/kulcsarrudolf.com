import { type KeyboardEvent, useEffect, useRef } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import { CENTER, place, SHAPE_RADIUS, type Verdict } from "./board";
import { SHAPES } from "./shapes";

export interface GalleryEntry {
  id: string;
  /** How the shape's first cut went, or null while it has none. */
  verdict: Verdict | null;
  /** The shape on the board right now. */
  current: boolean;
}

interface BisectGalleryProps {
  entries: readonly GalleryEntry[];
  onPick: (id: string) => void;
  onClose: () => void;
}

const DEFINITIONS = new Map(SHAPES.map((shape) => [shape.id, shape]));

// The thumbnails show the box the shapes are fitted into, not the whole board,
// so each one fills its tile.
const MARGIN = 4;
const VIEW = [
  CENTER[0] - SHAPE_RADIUS - MARGIN,
  CENTER[1] - SHAPE_RADIUS - MARGIN,
  (SHAPE_RADIUS + MARGIN) * 2,
  (SHAPE_RADIUS + MARGIN) * 2,
].join(" ");

// The colours of the summary's tiles, so a shape reads the same in both.
const DOT: Record<Verdict, string> = {
  perfect: "bg-emerald-300",
  win: "bg-amber-300",
  miss: "bg-gray-500",
};

/**
 * Every shape at once, `ls` style, for choosing which one to cut. A shape
 * already cut carries a dot in the colour of its result, and the one on the
 * board is ringed. The current shape takes the focus on the way in, and
 * Escape goes back to it without choosing.
 */
const BisectGallery = ({ entries, onPick, onClose }: BisectGalleryProps) => {
  const { t } = useTranslation();
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "Escape") return;
    // Escape leaves the list, not the window around it.
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  return (
    <ul
      className="grid grid-cols-4 gap-2 sm:grid-cols-5"
      aria-label={t("bisect.gallery.label") as string}
      onKeyDown={onKeyDown}
    >
      {entries.map((entry) => {
        const definition = DEFINITIONS.get(entry.id);
        if (!definition) return null;
        const { path } = place(definition);
        return (
          <li key={entry.id}>
            <button
              type="button"
              ref={entry.current ? currentRef : undefined}
              onClick={() => onPick(entry.id)}
              aria-current={entry.current || undefined}
              className={`relative flex w-full flex-col items-center gap-1 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200 focus-visible:outline-2 focus-visible:outline-brand-on-dark ${
                entry.current ? "bg-white/5 ring-1 ring-brand-on-dark" : ""
              }`}
            >
              <svg viewBox={VIEW} aria-hidden="true" className="aspect-square w-full">
                <path d={path} className="fill-brand-on-dark" />
              </svg>
              <span className="w-full truncate text-center text-[10px]">{entry.id}</span>
              {entry.verdict && (
                <span
                  className={`absolute top-1.5 right-1.5 size-2 rounded-full ${DOT[entry.verdict]}`}
                >
                  <span className="sr-only">{t(`bisect.verdict.${entry.verdict}`)}</span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default BisectGallery;
