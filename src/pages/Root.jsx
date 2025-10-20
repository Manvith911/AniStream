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
    "Jujutsu Kaisen",
    "My Hero Academia",
    "Naruto",
    "Spy x Family",
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
      {/* Light overlay so background is visible */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex items-center justify-center px-4 md:px-10 py-10 flex-grow">
          <div className="w-full max-w-6xl bg-[#0b0b14]/80 border border-[#1e1e2f] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row backdrop-blur-md">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
              {/* Logo */}
              <div className="flex justify-start mb-4">
                <Logo />
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center bg-[#151521] border border-[#2a2a3b] rounded-lg overflow-hidden focus-within:border-blue-500 transition"
              >
                <input
                  type="text"
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime..."
                  className="flex-grow px-4 py-2 text-white placeholder-gray-400 bg-transparent focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2"
                >
                  <FaSearch />
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
                      className="bg-[#1a1a28] hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-md text-sm text-gray-300"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <Link
                  to="/home"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all duration-300"
                >
                  Watch Anime <FaArrowCircleRight />
                </Link>
              </div>
            </div>

            {/* Right Section - Banner */}
            <div className="w-full md:w-1/2 relative">
              <img
                src={banner}
                alt="Anime Banner"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14]/70 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
