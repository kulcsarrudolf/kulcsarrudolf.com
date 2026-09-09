import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * `primary` is the filled brand button, and there is only ever one of them in
 * view. `secondary` is white with a grey hairline, the same treatment as the
 * Currently Focused On arrows, so it never competes with the primary.
 */
export type ButtonVariant = "primary" | "secondary";

// Both variants carry a border, transparent on the filled one, so an outlined
// button never ends up two pixels taller than the filled one beside it.
const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-lg border px-6 py-3 text-base font-semibold transition-colors";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-brand text-white hover:bg-brand-hover",
  secondary: "border-gray-300 bg-white text-brand shadow-sm hover:bg-gray-50",
};

/**
 * The button look on its own, for the anchors and router links that have to
 * read as buttons without being one.
 */
export const buttonClasses = (
  variant: ButtonVariant = "primary",
  className = "",
) => `${BASE} ${VARIANTS[variant]} ${className}`.trim();

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const Button = ({
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
