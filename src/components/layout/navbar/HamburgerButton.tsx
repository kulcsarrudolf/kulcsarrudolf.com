interface HamburgerButtonProps {
  onClick: () => void;
  isOpen: boolean;
  /** Id of the element this button controls, for `aria-controls`. */
  controls: string;
  label: string;
  className?: string;
}

const HamburgerButton = ({
  onClick,
  isOpen,
  controls,
  label,
  className = "",
}: HamburgerButtonProps) => (
  <button
    type="button"
    className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-white transition-colors hover:border-white hover:bg-brand-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
    aria-controls={controls}
    aria-expanded={isOpen}
    aria-label={label}
    onClick={onClick}
  >
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  </button>
);

export default HamburgerButton;
