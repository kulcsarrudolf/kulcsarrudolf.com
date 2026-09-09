import type { ReactNode } from "react";

import CloseButton from "../CloseButton";

import useModalTransition from "./useModalTransition";

interface ModalProps {
  /** Unmount the dialog. Called after the fade out, not on the click. */
  onClose: () => void;
  /**
   * A function child receives the animated close, for the dialogs that need to
   * dismiss themselves from a control of their own.
   */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** Width and padding for the white panel. */
  panelClassName?: string;
  /** Accessible name for the × in the corner. Omit it and there is no ×. */
  closeLabel?: string;
}

// Full bleed on a phone, a centred card from `md` up.
const PANEL =
  "relative flex h-full w-full transform flex-col justify-center bg-white shadow-2xl transition-all duration-200 md:mx-4 md:h-auto md:w-auto md:rounded-2xl";

/**
 * A dialog over a dimmed backdrop, fading and scaling in on mount and back out
 * on dismissal. Clicking the backdrop closes it; clicking the panel does not.
 */
const Modal = ({ onClose, children, panelClassName = "p-6", closeLabel }: ModalProps) => {
  const { isVisible, close } = useModalTransition(onClose);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        className={`${PANEL} ${panelClassName} ${isVisible ? "scale-100" : "scale-95"}`}
        onClick={(event) => event.stopPropagation()}
      >
        {closeLabel && <CloseButton onClick={close} label={closeLabel} />}
        {typeof children === "function" ? children(close) : children}
      </div>
    </div>
  );
};

export default Modal;
