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
    "One-Punch Man",
    "My Hero Academia",
    "Demon Slayer",
    "Spy x Family",
    "Gachiakuta",
    "Sailor Moon",
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex items-center justify-center px-4 md:px-10 py-10 flex-grow">
          <div className="w-full max-w-6xl bg-[#1b1b2e]/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row backdrop-blur-lg border border-pink-500/20">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
              {/* Logo */}
              <div className="flex justify-start">
                <Logo />
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 p-[2px] rounded-full"
              >
                <div className="flex items-center bg-[#121224] rounded-full flex-grow px-3">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={value}
                    onChange={changeInput}
                    placeholder="Search anime..."
                    className="flex-grow px-2 py-2 text-white placeholder-gray-400 bg-transparent text-base focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition"
                >
                  Search
                </button>
              </form>

              {/* Trending Tags */}
              <div>
                <p className="text-sm text-gray-300 mb-2 font-semibold">
                  Trending now:
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
                      }
                      className="bg-[#2b2b40] hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all px-3 py-1 rounded-full text-sm text-gray-300"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <div className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 p-[2px] rounded-full inline-block shadow-lg">
                  <Link
                    to="/home"
                    className="flex items-center gap-2 px-6 py-3 bg-[#1b1b2e] text-white font-semibold rounded-full hover:bg-[#29294a] transition-all duration-300"
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
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b2e]/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
