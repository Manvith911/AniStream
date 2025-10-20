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
      className="min-h-[100dvh] w-full flex flex-col bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${background})`,
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-6 py-12 text-center relative">
        {/* Center Logo and Title */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <Logo className="w-20 md:w-24 mb-3" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,200,0,0.4)]">
              AnimeRealm
            </span>
          </h1>
          <p className="text-gray-300 mt-2 text-lg max-w-md">
            Search, watch, and explore your favorite anime — all in one place.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-lg mt-6 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.2)] overflow-hidden transition-all focus-within:shadow-[0_0_35px_rgba(255,200,0,0.4)]"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Search anime..."
            className="flex-grow px-5 py-3 text-gray-800 text-lg outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-200 font-bold"
          >
            <FaSearch size={18} />
          </button>
        </form>

        {/* Banner Image */}
        <div className="mt-10 flex justify-center">
          <img
            src={banner}
            alt="Anime banner"
            className="w-[280px] md:w-[420px] lg:w-[480px] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-xl"
          />
        </div>

        {/* Explore Button */}
        <div className="mt-8">
          <Link
            to="/home"
            className="inline-flex items-center gap-3 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full shadow-[0_0_15px_rgba(255,200,0,0.4)] transition-transform hover:scale-105"
          >
            Explore Animes <FaArrowCircleRight />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Root;
