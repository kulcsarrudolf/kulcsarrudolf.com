import Link from "next/link";

const NAVBAR_ELEMENTS = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Me",
    href: "/about-me",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const Navbar = () => {
  return (
    <div className="border border-black-500 px-4 py-2 rounded-xl mb-2 flex flex-row">
      {NAVBAR_ELEMENTS.map((element) => (
        <Link key={element.title} href={element.href} className="ml-2">
          <p>{element.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
