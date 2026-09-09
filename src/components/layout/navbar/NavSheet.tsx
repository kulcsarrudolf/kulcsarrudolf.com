import { useEffect, useRef } from "react";

import LangSelector from "@/components/layout/footer/LangSelector";
import CloseButton from "@/components/ui/CloseButton";
import { useTranslation } from "@/i18n/useTranslation";

import Brand from "./Brand";
import MenuItems from "./MenuItems";
import SocialMediaLinks from "./SocialMediaLinks";

interface NavSheetProps {
  id: string;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The mobile menu, built from the vocabulary the site already owns: the same
 * full-bleed white panel over a `bg-black/50` backdrop that WelcomeModal and
 * SudokuModal use. Rows are full width, so the whole row is the target and the
 * current-page highlight spans it.
 */
const NavSheet = ({ id, onClose }: NavSheetProps) => {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      // Keep tabbing inside the sheet while it is open.
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 nav:hidden" id={id}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu") as string}
        className="absolute inset-0 flex flex-col bg-white px-5 py-8"
      >
        <CloseButton ref={closeRef} onClick={onClose} label={t("nav.close") as string} />

        <div className="mb-5 px-4">
          <Brand tone="onSurface" onNavigate={onClose} />
        </div>

        <MenuItems variant="sheet" onNavigate={onClose} />

        <div className="flex-1" />

        <SocialMediaLinks size="md" tone="onSurface" padded className="mb-2 justify-center" />
        <LangSelector className="justify-center" onSelect={onClose} />
      </div>
    </div>
  );
};

export default NavSheet;
