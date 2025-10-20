import { FaArrowRight, FaSearch } from "react-icons/fa";
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
      className="min-h-[100vh] w-full bg-[#111122] text-white flex flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Centered Hero Card */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl bg-[#1b1b2a]/90 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden border border-[#2a2a3d]">
          {/* Left Content */}
          <section className="flex-1 w-full p-8 md:p-12 text-center md:text-left">
            <Logo className="mx-auto md:mx-0 mb-6" />

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

            {/* Top Searches */}
            <div className="text-sm text-gray-300 mt-6 leading-relaxed">
              <p className="font-semibold text-white mb-1">Top search:</p>
              <p className="text-gray-400">
                One Piece, One Punch Man Season 3, Demon Slayer, Jujutsu Kaisen,
                My Hero Academia, Spy x Family, Chainsaw Man
              </p>
            </div>

            {/* Watch Button */}
            <Link
              to="/home"
              className="inline-flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 text-black font-semibold rounded-lg px-6 py-3 shadow-lg transition-all mt-8"
            >
              Watch anime <FaArrowRight />
            </Link>
          </section>

          {/* Right Image */}
          <section className="flex-1 flex justify-center items-center p-6 md:p-0">
            <img
              src={banner}
              alt="Anime Collage"
              className="rounded-[1.5rem] w-full max-w-md object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Root;
