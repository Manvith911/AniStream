import { FaArrowRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png"; // Replace with your Chopper image
import background from "../assets/background.jpg"; // Background pattern
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
      className="min-h-screen w-full flex flex-col text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>

      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-[#1b1b2a]/90 border border-[#2a2a3d]/50 backdrop-blur-2xl rounded-[1.8rem] shadow-[0_0_40px_rgba(255,192,203,0.1)] hover:shadow-[0_0_70px_rgba(255,192,203,0.3)] transition-all duration-500 p-10">
          
          {/* Left Side */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 flex-1">
            <Logo className="scale-110 mb-4" />

            {/* Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-[#2b2b3f] rounded-xl overflow-hidden shadow-inner max-w-xs sm:max-w-sm md:max-w-md w-full focus-within:ring-2 focus-within:ring-pink-400 transition-all duration-300"
            >
              <input
                type="text"
                placeholder="Search anime..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-grow px-5 py-3 text-gray-200 placeholder-gray-400 bg-transparent focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="bg-[#3b3b55] hover:bg-pink-400 hover:text-black p-3 transition-all duration-300 flex items-center justify-center"
              >
                <FaSearch className="text-gray-200 hover:text-black" />
              </button>
            </form>

            {/* Watch Button */}
            <Link
              to="/home"
              className="inline-flex items-center justify-center gap-2 bg-[#2b2b3f] hover:bg-pink-400 hover:text-black text-white font-medium rounded-xl px-6 py-3 mt-2 shadow-[0_0_10px_rgba(255,192,203,0.2)] hover:shadow-[0_0_25px_rgba(255,192,203,0.6)] transition-all duration-300"
            >
              Watch anime <FaArrowRight />
            </Link>
          </section>

          {/* Right Image */}
          <section className="flex justify-center items-center mt-10 md:mt-0 md:ml-8 flex-1">
            <img
              src={banner}
              alt="Anime character"
              className="w-64 md:w-80 drop-shadow-[0_0_25px_rgba(255,192,203,0.3)] hover:drop-shadow-[0_0_45px_rgba(255,192,203,0.6)] transition-all duration-500"
              loading="lazy"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Root;
