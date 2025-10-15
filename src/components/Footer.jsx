import React from "react";
import Logo from "./Logo";
import AZ from "../layouts/AZ";
import { FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#0a0a0f] text-white py-8 px-4 md:px-10 border-t border-white/10">
      {/* Logo */}
      <div className="flex justify-center items-center mb-4">
        <Logo />
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-white/20 mb-6"></div>

      {/* A-Z info */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-4 text-center md:text-left">
        <p className="text-purple-400 font-bold text-sm">A-Z List</p>
        <p className="hidden sm:block text-gray-400 text-sm">
          Search anime in alphabetical order from A to Z.
        </p>
      </div>

      {/* A-Z Layout */}
      <div className="flex justify-center mb-6">
        <AZ />
      </div>

      {/* Disclaimer */}
      <div className="text-center text-gray-400 text-sm mb-4">
        <p>
          AnimeRealm does not store any files on our server. We only link to media hosted on
          third-party services.
        </p>
        <p className="mt-2">© AnimeRealm All rights reserved.</p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-4">
        <a
          href="https://discord.gg/be774snHsP"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors text-2xl"
        >
          <FaDiscord />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
