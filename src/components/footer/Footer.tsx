"use client";

import Copyright from "./Copyright";
import LangSelector from "./LangSelector";

const Footer = () => {
  return (
    <footer className="py-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2 md:gap-0 text-sm">
        <LangSelector />
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
