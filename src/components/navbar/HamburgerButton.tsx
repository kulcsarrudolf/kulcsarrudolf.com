interface HamburgerButtonProps {
  onClick: () => void;
}
const HamburgerButton = ({ onClick }: HamburgerButtonProps) => (
  <button
    data-collapse-toggle="navbar-sticky"
    type="button"
    className="ml-5 inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-transparent  "
    aria-controls="navbar-sticky"
    aria-expanded="false"
    onClick={onClick}
  >
    <span className="sr-only">Open main menu</span>
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="#fff"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clip-rule="evenodd"
      ></path>
    </svg>
  </button>
);

export default HamburgerButton;
