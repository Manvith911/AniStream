import React from "react";
import AZ from "../layouts/AZ";
import { FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 bg-[#0a0a0f] text-gray-300 py-6 px-4 md:px-8 border-t border-white/10 text-sm">
      {/* A-Z Section */}
      <div className="text-center mb-4">
        <p className="text-purple-400 font-semibold mb-1">A–Z List</p>
        <p className="text-gray-400 text-xs">
          Browse anime alphabetically from A to Z.
        </p>
      </div>

      {/* A-Z Layout */}
      <div className="flex justify-center mb-4">
        <AZ />
      </div>

      {/* Disclaimer */}
      <div className="text-center text-gray-500 text-xs mb-3 max-w-2xl mx-auto px-2 leading-relaxed">
        <p>
          AnimeRealm does not host or store any files on its server.  
          All media is provided by third-party services.
        </p>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-white/10 mb-3"></div>

      {/* Bottom Row */}
      <div className="flex justify-center items-center gap-4">
        <a
          href="https://discord.gg/be774snHsP"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors text-lg"
        >
          <FaDiscord />
        </a>
        <span className="text-xs text-gray-500">© 2025 AnimeRealm</span>
      </div>
    </footer>
  );
};

export default Footer;
