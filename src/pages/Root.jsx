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
      className="min-h-screen w-full bg-[#111122] text-white flex flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between bg-[#1b1b2a]/90 border border-[#2a2a3d] backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden">
          
          {/* Left Section */}
          <section className="flex-1 w-full p-8 md:p-12 text-center md:text-left">
            <Logo className="mx-auto md:mx-0 mb-10" />

            {/* Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-md mx-auto md:mx-0"
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

            {/* Watch Button */}
            <Link
              to="/home"
              className="inline-flex items-center justify-center gap-2 bg-pink-400 hover:bg-pink-500 text-black font-semibold rounded-lg px-8 py-3 shadow-lg transition-all mt-10"
            >
              Watch anime <FaArrowRight />
            </Link>
          </section>

          {/* Right Banner */}
          <section className="flex-1 flex justify-center items-center p-8 md:p-0">
            <img
              src={banner}
              alt="Anime Banner"
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
