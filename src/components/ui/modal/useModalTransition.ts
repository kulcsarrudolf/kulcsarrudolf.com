import { useCallback, useEffect, useState } from "react";

/** Long enough to read as a fade, short enough not to delay the dismissal. */
export const MODAL_TRANSITION_MS = 200;

/**
 * Fades a dialog in on mount and back out on the way to unmounting.
 *
 * `isVisible` starts false and is flipped right after mount, once the browser
 * has computed the closed state, so there is something to transition away
 * from. That first computation is forced with a layout read rather than
 * waited for on a frame callback: frames pause in a covered or embedded page,
 * and a dialog waiting on one sat at opacity zero with only its backdrop
 * showing. `close` reverses it and only then hands control back to the parent,
 * which is what actually unmounts the dialog.
 */
export function useModalTransition(onClose: () => void) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    void document.body.offsetHeight;
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, MODAL_TRANSITION_MS);
  }, [onClose]);

  return { isVisible, close };
}
