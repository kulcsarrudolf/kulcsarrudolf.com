"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import SocialMediaLinks from "./SocialMediaLinks";
import HamburgerButton from "./HamburgerButton";
import MenuItems from "./MenuItems";
import NavbarData from "./data";

const Navbar = () => {
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
      console.log(window.scrollY);

      if (window.scrollY > scrollThreshold) {
        setMarginTop(false);
        console.log("scrolling down");

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

  const { title, logoSrc, link } = NavbarData;

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
          <a href={link} className="flex items-center">
            <Image
              width={40}
              height={40}
              src={logoSrc}
              className="mr-3 rounded-full shadow-md"
              alt="Rudolf"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              {title}
            </span>
          </a>
          <div className="flex md:order-2" style={{ alignItems: "center" }}>
            <SocialMediaLinks />
            <HamburgerButton onClick={toggleNavbar} />
          </div>
          <div
            className={`flex-grow justify-end pt-6 md:pt-0 ${mNavBarVisible} w-full md:flex md:w-auto md:order-1 `}
            id="navbar-sticky"
          >
            <MenuItems onClick={() => setIsNavbarOpen(false)} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
