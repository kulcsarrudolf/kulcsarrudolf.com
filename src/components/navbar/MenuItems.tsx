import { NAVBAR_ELEMENTS } from "./navber-links";
import NavbarElement from "@/types/navbar-element.type";
import Link from "next/link";

interface MenuItemsProps {
  onClick: () => void;
}
const MenuItems = ({ onClick }: MenuItemsProps) => (
  <ul className="flex flex-col font-medium md:flex-row md:align-middle md:space-x-4">
    {NAVBAR_ELEMENTS.map((element: NavbarElement) => (
      <Link
        key={element.title}
        href={element.href}
        onClick={onClick}
        className="mb-4 md:mb-0"
      >
        <p className="text-white hover:font-bold">{element.title}</p>
      </Link>
    ))}
  </ul>
);

export default MenuItems;
