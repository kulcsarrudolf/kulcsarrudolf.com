"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import SocialMediaLinks from "./SocialMediaLinks";
import HamburgerButton from "./HamburgerButton";
import MenuItems from "./MenuItems";
import NavbarAvatar from "./NavbarAvatar";
import NavbarData from "./data";

const Navbar = () => {
  const router = useRouter();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [marginTop, setMarginTop] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node | null;
      if (ref.current && targetNode && !ref.current.contains(targetNode)) {
        setIsNavbarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    const scrollThreshold = 100;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        setMarginTop(false);
        setIsNavbarOpen(false);
      }

      if (window.scrollY < scrollThreshold) {
        setMarginTop(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mNavBarVisible = isNavbarOpen ? "" : "hidden";

  const { title, logoSrc } = NavbarData;

  return (
    <>
      <nav
        className={`fixed w-full z-20 top-0 left-0 ${
          marginTop ? "mt-5" : "mt-0"
        } px-2`}
        ref={ref}
      >
        <div
          className={`max-w-5xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-2xl ${
            marginTop ? "" : "rounded-t-none"
          } shadow-md bg-[#4267b2]`}
        >
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <NavbarAvatar src={logoSrc} alt="Rudolf" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              {title}
            </span>
          </div>
          <div className="flex items-center md:order-2">
            <div className="hidden min-[475px]:block">
              <SocialMediaLinks />
            </div>
            <HamburgerButton onClick={toggleNavbar} />
          </div>
          <div
            className={`flex-grow justify-end pt-6 md:pt-0 ${mNavBarVisible} w-full md:flex md:w-auto md:order-1 `}
            id="navbar-sticky"
          >
            <MenuItems onClick={() => setIsNavbarOpen(false)} />
            <div className="mt-4 flex gap-4 justify-center min-[475px]:hidden">
              <SocialMediaLinks iconClassName="ml-0" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
