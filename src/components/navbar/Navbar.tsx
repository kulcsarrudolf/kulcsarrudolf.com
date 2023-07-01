"use client";
import Image from "next/image";

import { useState } from "react";

import SocialMediaLinks from "./SocialMediaLinks";
import HamburgerButton from "./HamburgerButton";
import MenuItems from "./MenuItems";
import NavbarData from "./data";

const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
  };

  const mNavBarVisible = isNavbarOpen ? "" : "hidden";

  const { title, logoSrc, link } = NavbarData;

  return (
    <>
      <nav className="fixed w-full z-20 top-0 left-0  mt-5 p-2">
        <div
          className="max-w-5xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-2xl shadow-md"
          style={{ backgroundColor: "#4267b2" }}
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
