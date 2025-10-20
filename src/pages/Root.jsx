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

  const changeInput = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return; // Avoid navigating with empty input
    navigate(`/search?keyword=${value}`);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center min-h-[90vh] flex items-center justify-center px-4 md:px-10"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

        <div className="relative z-10 w-full max-w-4xl text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center w-full gap-2"
          >
            <input
              value={value}
              onChange={changeInput}
              type="text"
              placeholder="Search anime..."
              className="w-full md:w-3/4 px-4 py-2 rounded-l-md bg-white text-black placeholder-gray-600 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-r-md hover:opacity-90 transition-all"
            >
              <FaSearch />
            </button>
          </form>

          {/* Banner Image */}
          <div className="flex justify-center">
            <img
              src={banner}
              alt="Anime Banner"
              className="w-[300px] md:w-[400px] rounded-md shadow-lg"
            />
          </div>

          {/* Explore Button */}
          <div className="flex justify-center">
            <Link
              to="/home"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Explore Animes <FaArrowCircleRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
