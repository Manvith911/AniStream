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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) navigate(`/search?keyword=${value}`);
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col bg-[#131321] text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full bg-[#1b1b2a]/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Left Side */}
          <section className="flex-1 text-center md:text-left space-y-6">
            <Logo className="mx-auto md:mx-0 mb-4" />

            {/* Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-between bg-white rounded-lg overflow-hidden shadow-md max-w-md mx-auto md:mx-0"
            >
              <input
                type="text"
                placeholder="Search anime..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-grow px-5 py-3 text-black placeholder-gray-500 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="bg-pink-400 hover:bg-pink-500 p-3 transition-colors flex items-center justify-center"
              >
                <FaSearch className="text-black" />
              </button>
            </form>

            {/* Top Search */}
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-white mb-1">Top search:</p>
              <p className="space-x-2 leading-relaxed text-gray-400">
                One Piece, One-Punch Man Season 3, My Hero Academia, Demon Slayer, 
                Spy x Family, Jujutsu Kaisen, Chainsaw Man
              </p>
            </div>

            {/* Watch Button */}
            <Link
              to="/home"
              className="inline-flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 text-black font-semibold rounded-lg px-6 py-3 shadow-lg transition-colors"
            >
              Watch anime <FaArrowCircleRight />
            </Link>
          </section>

          {/* Right Side (Banner Image) */}
          <section className="flex-1 mt-8 md:mt-0 md:ml-8 flex justify-center">
            <img
              src={banner}
              alt="Anime collage"
              className="rounded-3xl shadow-lg w-full max-w-md object-cover opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Root;
