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
      className="relative min-h-[100dvh] w-full overflow-hidden text-white"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient + glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015]/95 via-[#0f0025]/90 to-[#0d0018]/95"></div>

      {/* Floating glows */}
      <div className="absolute -top-20 left-20 w-72 h-72 bg-fuchsia-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-600/20 blur-[130px] rounded-full"></div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center md:justify-between h-[85vh] px-6 md:px-16">
        {/* Left side */}
        <div className="flex-1 max-w-lg text-center md:text-left backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <Logo className="mx-auto md:mx-0 mb-6" />

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent leading-tight">
            Welcome to the World of Anime
          </h1>

          <p className="text-gray-300 mb-8 text-lg font-light">
            Watch, explore, and fall in love with your favorite anime — all in one place.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all focus-within:ring-2 focus-within:ring-pink-400"
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Search anime..."
              className="flex-grow px-5 py-3 text-white placeholder-gray-300 bg-transparent text-lg outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:opacity-90 transition-opacity"
            >
              <FaSearch size={20} />
            </button>
          </form>

          {/* Explore Button */}
          <div className="mt-8">
            <Link
              to="/home"
              className="inline-flex items-center gap-3 px-8 py-3 font-semibold text-lg rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(255,0,255,0.3)]"
            >
              Explore Animes
              <FaArrowCircleRight className="animate-pulse" />
            </Link>
          </div>
        </div>

        {/* Right side - Banner */}
        <div className="flex-1 flex justify-center mt-10 md:mt-0 relative">
          <img
            src={banner}
            alt="Anime banner"
            className="w-[320px] md:w-[480px] lg:w-[520px] drop-shadow-[0_0_35px_rgba(255,0,255,0.3)] animate-float"
          />
        </div>
      </div>

      {/* Floating animation keyframe */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Root;
