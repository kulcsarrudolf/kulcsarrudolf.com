import { useCallback, useEffect, useState } from "react";

/** Long enough to read as a fade, short enough not to delay the dismissal. */
export const MODAL_TRANSITION_MS = 200;

/**
 * Fades a dialog in on mount and back out on the way to unmounting.
 *
 * `isVisible` starts false and is flipped on the next frame, so the browser has
 * a first paint at the closed state to transition away from. `close` reverses
 * it and only then hands control back to the parent, which is what actually
 * unmounts the dialog.
 */
export function useModalTransition(onClose: () => void) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, MODAL_TRANSITION_MS);
  }, [onClose]);

  return { isVisible, close };
}
