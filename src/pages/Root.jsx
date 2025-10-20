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
      className="min-h-screen w-full flex flex-col text-white bg-[#0e0e19]"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-[#1b1b2a]/95 border border-[#2a2a3d] backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_rgba(255,192,203,0.2)] overflow-hidden transition-all duration-300">
          
          {/* Left Content */}
          <section className="flex-1 w-full p-10 md:p-14 text-center md:text-left space-y-8">
            <Logo className="mx-auto md:mx-0 mb-6 scale-110" />

            {/* Search Box */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white/95 rounded-xl overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,192,203,0.3)] transition-all duration-300 max-w-md mx-auto md:mx-0"
            >
              <input
                type="text"
                placeholder="Search anime..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-grow px-5 py-3.5 text-gray-800 placeholder-gray-500 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="bg-pink-400 hover:bg-pink-500 p-4 transition-all duration-300 flex items-center justify-center"
              >
                <FaSearch className="text-black text-lg" />
              </button>
            </form>

            {/* Watch Button */}
            <Link
              to="/home"
              className="inline-flex items-center justify-center gap-3 bg-pink-400 hover:bg-pink-500 text-black font-semibold rounded-xl px-8 py-3.5 shadow-[0_0_15px_rgba(255,192,203,0.4)] hover:shadow-[0_0_25px_rgba(255,192,203,0.6)] transition-all duration-300"
            >
              Watch anime <FaArrowRight className="text-lg" />
            </Link>
          </section>

          {/* Right Image */}
          <section className="flex-1 flex justify-center items-center p-10 md:p-0">
            <img
              src={banner}
              alt="Anime Collage"
              className="rounded-[1.5rem] w-full max-w-md object-cover drop-shadow-[0_0_40px_rgba(255,192,203,0.2)] hover:drop-shadow-[0_0_60px_rgba(255,192,203,0.4)] transition-all duration-500"
              loading="lazy"
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Root;
