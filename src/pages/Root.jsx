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

  const changeInput = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/search?keyword=${value}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 min-h-screen text-white">
        <Navbar />

        <div className="flex items-center justify-center px-4 md:px-10 py-10">
          <div className="w-full max-w-6xl bg-[#1e1e2f]/90 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
              {/* Logo */}
              <div className="flex justify-start">
                <Logo />
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center rounded-full overflow-hidden bg-white border-2 border-pink-400"
              >
                <input
                  type="text"
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime..."
                  className="flex-grow px-4 py-2 text-black placeholder-gray-500 text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-4 py-2 hover:bg-pink-400 transition"
                >
                  <FaSearch />
                </button>
              </form>

              {/* Trending Tags */}
              <div>
                <p className="text-sm text-gray-100 mb-2 font-semibold">Trending now:</p>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
                      }
                      className="bg-[#2f2f4f] hover:bg-pink-500 hover:text-black transition px-3 py-1 rounded-full text-sm text-gray-200"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button inside gradient capsule */}
              <div className="mt-6">
                <div className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 p-[2px] rounded-full inline-block shadow-lg">
                  <Link
                    to="/home"
                    className="flex items-center gap-2 px-6 py-3 bg-[#1e1e2f] text-white font-semibold rounded-full hover:bg-[#2c2c44] transition-all duration-300"
                  >
                    Watch Anime <FaArrowCircleRight />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Section - Banner */}
            <div className="w-full md:w-1/2">
              <img
                src={banner}
                alt="Anime Banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
