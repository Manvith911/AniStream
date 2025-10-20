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
    if (value.trim()) {
      navigate(`/search?keyword=${value}`);
    }
  };

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-black text-white">
      {/* Background Image + Colour Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between h-[90vh] px-6 md:px-16">
        {/* Left: Text + Search */}
        <div className="flex-1 max-w-lg text-center md:text-left">
          <Logo className="mx-auto md:mx-0 mb-6" />

          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4">
            Dive Into The Anime World
          </h1>

          <p className="text-gray-300 mb-8 text-lg">
            Search your favourite anime, explore characters & episodes. Let the story begin.
          </p>

          <form onSubmit={handleSubmit} className="flex items-center w-full bg-white rounded-full overflow-hidden shadow-lg">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Search anime..."
              className="flex-grow px-5 py-3 text-black text-lg outline-none"
            />
            <button type="submit" className="px-5 bg-cyan-400 hover:bg-cyan-500 text-black transition-colors">
              <FaSearch size={20} />
            </button>
          </form>

          <div className="mt-8">
            <Link
              to="/home"
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-full transition-transform transform hover:scale-105"
            >
              Explore Animes
              <FaArrowCircleRight size={20} />
            </Link>
          </div>
        </div>

        {/* Right: Banner Illustration */}
        <div className="flex-1 mt-12 md:mt-0 flex justify-center">
          <img
            src={banner}
            alt="Anime banner"
            className="w-[300px] md:w-[450px] drop-shadow-[0_0_30px_rgba(0,200,255,0.4)] animate-float"
          />
        </div>
      </div>
    </div>
  );
};

export default Root;
