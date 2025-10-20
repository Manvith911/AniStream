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
      className="min-h-[100dvh] w-full flex flex-col text-white bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10,10,15,0.85), rgba(5,5,10,0.95)), url(${background})`,
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow container mx-auto flex flex-col items-center justify-center px-6 md:px-12 py-12 relative z-10">
        {/* Center logo and heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <Logo className="w-20 md:w-24 mb-3" />
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,200,0,0.4)]">
            AnimeRealm
          </h1>
          <p className="text-gray-300 mt-3 text-lg max-w-2xl">
            Dive into your favorite anime worlds — search, explore, and watch seamlessly.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-xl bg-white/95 backdrop-blur-md rounded-full shadow-[0_0_25px_rgba(255,255,255,0.15)] overflow-hidden hover:shadow-[0_0_35px_rgba(255,200,0,0.4)] transition-all duration-300"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search anime..."
            className="flex-grow px-6 py-3 text-black text-lg focus:outline-none placeholder-gray-600"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:opacity-90 transition-opacity"
          >
            <FaSearch size={20} />
          </button>
        </form>

        {/* Banner */}
        <div className="mt-12 flex justify-center">
          <img
            src={banner}
            alt="Anime banner"
            className="w-[280px] md:w-[420px] lg:w-[480px] rounded-xl drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] animate-float"
          />
        </div>

        {/* Explore Button */}
        <Link
          to="/home"
          className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full shadow-[0_0_20px_rgba(255,200,0,0.5)] hover:scale-105 transition-transform duration-300"
        >
          Explore Animes <FaArrowCircleRight />
        </Link>
      </main>

      {/* Glow Elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-500/10 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 blur-[150px]"></div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Root;
