import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg"; // Optional if using a page background
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
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <Navbar />

      <div className="flex items-center justify-center px-4 md:px-10 py-10">
        <div className="w-full max-w-6xl bg-[#121222] rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
            {/* Logo */}
            <div className="flex justify-start">
              <Logo />
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center rounded-lg overflow-hidden bg-white"
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
                className="bg-pink-400 text-black px-4 py-2 hover:bg-pink-300 transition"
              >
                <FaSearch />
              </button>
            </form>

            {/* Trending Keywords as Tags */}
            <div>
              <p className="text-sm text-white mb-2 font-semibold">Trending now:</p>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/search?keyword=${encodeURIComponent(keyword)}`)}
                    className="bg-gray-800 hover:bg-pink-500 hover:text-black transition px-3 py-1 rounded-full text-sm text-gray-200"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-400 text-black font-semibold rounded-xl hover:bg-pink-300 transition"
              >
                Watch anime <FaArrowCircleRight />
              </Link>
            </div>
          </div>

          {/* Right Section - Banner Image */}
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
  );
};

export default Root;
