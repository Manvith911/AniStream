import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg";   // ← imported asset
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
    navigate(`/search?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${background})` }}   // ← used here
    >
      {/* softer overlay so the picture is visible */}
      <div className="min-h-screen bg-black/50">
        <Navbar />

        <div className="flex items-center justify-center px-4 md:px-10 py-10">
          <div className="w-full max-w-6xl bg-[#1e1e2f]/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row backdrop-blur-md">
            {/* LEFT */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
              <div className="flex justify-start">
                <Logo />
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex items-center rounded-full overflow-hidden bg-white border-2 border-pink-400"
              >
                <input
                  type="text"
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime..."
                  className="flex-grow px-4 py-3 text-black placeholder-gray-500 text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-5 py-3 hover:bg-pink-400 transition"
                >
                  <FaSearch />
                </button>
              </form>

              <div>
                <p className="text-sm text-gray-100 mb-2 font-semibold">Trending now:</p>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map((k) => (
                    <button
                      key={k}
                      onClick={() => navigate(`/search?keyword=${encodeURIComponent(k)}`)}
                      className="bg-[#2f2f4f] hover:bg-pink-500 hover:text-black transition px-3 py-1 rounded-full text-sm text-gray-200"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

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

            {/* RIGHT */}
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
