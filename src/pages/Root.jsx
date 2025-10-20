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

      {/* Overlay with reduced opacity for better visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Main content - relative so it's above overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex items-center justify-center px-4 md:px-10 py-10 flex-grow">
          <div className="w-full max-w-6xl bg-black bg-opacity-60 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row backdrop-blur-md">
            {/* Left Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6 text-white drop-shadow-md">
              {/* Logo */}
              <div className="flex justify-start">
                <Logo />
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center rounded-full overflow-hidden bg-white border-2 border-yellow-400"
              >
                <input
                  type="text"
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime..."
                  className="flex-grow px-4 py-2 text-black placeholder-gray-600 text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 hover:bg-yellow-300 transition font-semibold"
                >
                  <FaSearch />
                </button>
              </form>

              {/* Trending Tags */}
              <div>
                <p className="text-sm text-yellow-300 mb-2 font-semibold drop-shadow">
                  Trending now:
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
                      }
                      className="bg-yellow-700 hover:bg-yellow-500 text-black transition px-3 py-1 rounded-full text-sm font-semibold drop-shadow"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button inside yellow-orange gradient capsule */}
              <div className="mt-6">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 p-[2px] rounded-full inline-block shadow-lg drop-shadow-lg">
                  <Link
                    to="/home"
                    className="flex items-center gap-2 px-6 py-3 bg-black bg-opacity-80 text-yellow-400 font-bold rounded-full hover:bg-yellow-600 hover:text-black transition-all duration-300"
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
                className="w-full h-full object-cover rounded-tr-3xl rounded-br-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
