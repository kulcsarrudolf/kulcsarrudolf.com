import { useTranslation } from "@/i18n/useTranslation";

import { BulbIcon } from "./icons";
import { useTheme } from "./useTheme";

interface ThemeToggleProps {
  /** White on the blue bar; brand blue inside the white menu sheet. */
  tone?: "onBrand" | "onSurface";
  className?: string;
}

// The same 44px box and hover treatment as the menu button beside it, so the
// two read as one row of controls.
const BASE =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2";

const TONES = {
  onBrand:
    "text-white hover:border-white hover:bg-brand-active focus-visible:ring-white dark:hover:bg-brand-dark-active",
  onSurface:
    "text-brand hover:bg-gray-100 focus-visible:ring-brand dark:text-brand-on-dark dark:hover:bg-fill-dark dark:focus-visible:ring-brand-on-dark",
};

/**
 * The light switch: a bulb that is lit while the page is light and goes out
 * when it is dark. It is a switch to assistive tech too, named "Dark mode"
 * and checked while that is on, rather than a button whose label has to be
 * re-read to learn which way it will go.
 *
 * The bulb itself follows the `dark` class on the document, so it is lit or
 * not from the first paint; `useTheme` only has to say which way the switch
 * is set, and to flip it.
 */
const ThemeToggle = ({ tone = "onBrand", className = "" }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = t("nav.darkMode") as string;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={`${BASE} ${TONES[tone]} ${className}`}
    >
      <BulbIcon />
    </button>
  );
};

export default ThemeToggle;
