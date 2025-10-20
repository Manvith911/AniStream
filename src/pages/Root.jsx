import { FaArrowCircleRight, FaSearch } from "react-icons/fa";
import banner from "../assets/homeBanner.png";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Root = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      className="min-h-[100dvh] w-full text-white flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <main className="flex-grow container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 gap-12">
        {/* Left Section */}
        <section className="max-w-xl text-center md:text-left animate-fadeIn">
          <Logo className="mx-auto md:mx-0 mb-6" />

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
            Your Gateway to <span className="text-yellow-400">Anime Worlds</span>
          </h1>

          <p className="text-gray-300 mb-8 text-lg">
            Search thousands of anime titles and dive deep into every story.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex max-w-md mx-auto md:mx-0 bg-white/95 backdrop-blur-sm rounded-full shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 transition"
            aria-label="Search anime"
          >
            <input
              type="text"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-5 py-3 text-black text-lg placeholder-gray-500 focus:outline-none"
              aria-label="Search input"
            />
            <button
              type="submit"
              aria-label="Search"
              className="px-5 bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-transform flex items-center justify-center"
            >
              <FaSearch size={18} />
            </button>
          </form>

          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 mt-8 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-black font-semibold rounded-full px-6 py-3 shadow-lg transition-transform"
          >
            Explore Animes <FaArrowCircleRight size={20} />
          </Link>
        </section>

        {/* Right Section */}
        <section className="flex justify-center max-w-lg w-full animate-slideUp">
          <img
            src={banner}
            alt="Anime characters collage"
            className="w-full max-w-md rounded-lg shadow-2xl transition-transform hover:scale-105 duration-300"
            loading="lazy"
          />
        </section>
      </main>

      <footer className="text-center text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} AnimeVerse. All rights reserved.
      </footer>
    </div>
  );
};

export default Root;
