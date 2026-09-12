import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * `primary` is the filled brand button, and there is only ever one of them in
 * view. `secondary` is white with a grey hairline, the same treatment as the
 * Currently Focused On arrows, so it never competes with the primary. On the
 * dark page the primary steps down to `brand-dark`, the fill the navbar uses
 * there, and the secondary becomes a raised card with the brand lightened.
 *
 * The two `onBrand` variants are the same pair inverted, for the one place
 * that sits on brand blue rather than on white: the Let's Talk band. White on
 * blue is the filled one there, and the outline is a white hairline. Both keep
 * the geometry of the pair above so a band button never reads as a different
 * kind of control.
 */
export type ButtonVariant = "primary" | "secondary" | "onBrand" | "onBrandOutline";

// Both variants carry a border, transparent on the filled one, so an outlined
// button never ends up two pixels taller than the filled one beside it.
const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3 text-base font-semibold transition-colors";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-brand text-white hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-dark-active",
  secondary:
    "border-gray-300 bg-white text-brand shadow-xs hover:bg-gray-50 dark:border-line-dark dark:bg-card-dark dark:text-brand-dark-accent dark:hover:bg-fill-dark",
  onBrand: "border-transparent bg-white text-brand hover:bg-gray-50",
  onBrandOutline: "border-white/55 bg-transparent text-white hover:bg-white/10",
};

/**
 * The button look on its own, for the anchors and router links that have to
 * read as buttons without being one.
 */
export const buttonClasses = (variant: ButtonVariant = "primary", className = "") =>
  `${BASE} ${VARIANTS[variant]} ${className}`.trim();

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button type={type} className={buttonClasses(variant, className)} {...props}>
    {children}
  </button>
);

export default Button;
