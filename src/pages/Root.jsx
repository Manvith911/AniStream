import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Root = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const trendingKeywords = [
    "One Piece",
    "Demon Slayer",
    "Attack on Titan",
    "Naruto",
    "Jujutsu Kaisen",
    "Spy x Family",
    "Chainsaw Man",
  ];

  const changeInput = (e) => setValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/search?keyword=${value}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Lighter overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 backdrop-blur-[1px]"></div>

      {/* Content Layer */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navbar always on top */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Main Section */}
        <div className="flex items-center justify-center px-4 md:px-10 py-10 flex-grow">
          <div className="z-10 w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.4)] flex flex-col md:flex-row border border-white/20">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
              {/* Logo */}
              <div className="flex justify-start mb-4">
                <Logo />
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center bg-white/15 rounded-full overflow-hidden border border-white/30 backdrop-blur-sm focus-within:border-pink-400 transition"
              >
                <input
                  type="text"
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime..."
                  className="flex-grow px-4 py-2 text-white placeholder-gray-300 bg-transparent focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition px-4 py-2"
                >
                  <FaSearch />
                </button>
              </form>

              {/* Trending Tags */}
              <div>
                <p className="text-sm text-gray-200 mb-2 font-semibold">
                  Trending now:
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
                      }
                      className="bg-white/15 hover:bg-pink-500 hover:text-black transition-all px-3 py-1 rounded-full text-sm text-gray-200 border border-white/20"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <div className="p-[2px] rounded-full inline-block bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 shadow-lg">
                  <Link
                    to="/home"
                    className="flex items-center gap-2 px-6 py-3 bg-[#1b1b2e]/80 text-white font-semibold rounded-full hover:bg-[#2a2a48]/80 transition-all duration-300"
                  >
                    Watch Anime <FaArrowCircleRight />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Section - Banner */}
            <div className="w-full md:w-1/2 relative">
              <img
                src={banner}
                alt="Anime Banner"
                className="w-full h-full object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14]/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
