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
      className="min-h-[100dvh] w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Navbar />

      <main className="flex-grow container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 gap-12">
        {/* Left Content */}
        <section className="max-w-xl text-center md:text-left">
          <Logo className="mx-auto md:mx-0 mb-6" />

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Your Gateway to Anime Worlds
          </h1>

          <p className="text-gray-300 mb-8 text-lg">
            Search thousands of anime titles and dive deep into every story.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex max-w-md mx-auto md:mx-0 bg-white rounded-full shadow-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search anime..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-grow px-5 py-3 text-black text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 bg-yellow-400 hover:bg-yellow-500 transition-colors"
            >
              <FaSearch size={18} />
            </button>
          </form>

          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 mt-8 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-6 py-3 shadow-lg transition"
          >
            Explore Animes <FaArrowCircleRight />
          </Link>
        </section>

        {/* Right Content */}
        <section className="flex justify-center max-w-lg w-full">
          <img
            src={banner}
            alt="Anime banner"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </section>
      </main>
    </div>
  );
};

export default Root;
