"use client";

import Copyright from "./Copyright";
import LangSelector from "./LangSelector";

const Footer = () => {
  return (
    <footer className="py-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between text-sm">
        <Copyright />
        <LangSelector />
      </div>
    </footer>
  );
};

export default Footer;
