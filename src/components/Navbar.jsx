import { useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(false);

  const navLinks = [
    { name: "Home", id: "/home" },
    { name: "Movies", id: "/animes/movie" },
    { name: "TV Series", id: "/animes/tv" },
    { name: "Most Popular", id: "/animes/most-popular" },
    { name: "Top Airing", id: "/animes/top-airing" },
  ];

  return (
    <nav>
      {/* Desktop Navbar */}
      <div className="nav hidden md:flex justify-center items-center pt-12 pb-10">
        {/* Increased padding-top (pt-12) and padding-bottom (pb-10) */}
        <ul className="flex gap-16"> {/* Increased gap between items */}
          {navLinks.map((item) => (
            <li className="hover:text-primary font-bold" key={item.id}>
              <a className="" href={item.id}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navbar */}
      <div className="block md:hidden relative w-full">
        <button onClick={() => setShow(!show)}>
          <h1 className="flex pt-8 pl-5 justify-center items-center gap-1"> {/* Increased padding-top (pt-8) */}
            <FaAlignJustify />
            Menu
          </h1>
        </button>
        <ul
          className={`${
            show ? "flex" : "hidden"
          } w-11/12 mx-3 absolute flex-col justify-center items-center z-10 bg-background rounded-md py-5 gap-3 md:gap-10`}
        >
          {navLinks.map((item) => (
            <li
              className="hover:text-primary hover:bg-lightBg w-full text-center py-2"
              key={item.id}
            >
              <Link className="" to={item.id}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
