/* eslint-disable react/prop-types */
import { useState } from "react";
import SoundsInfo from "../components/SoundsInfo";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import CircleRatting from "../components/CircleRatting";

const InfoLayout = ({ data, showBigPoster }) => {
  const [showFull, setShowFull] = useState(false);

  const colors = [
    "#d0e6a5",
    "#ffbade",
    "#fc887b",
    "#ccabda",
    "#abccd8",
    "#d8b2ab",
    "#86e3ce",
  ];

  return (
    <div className="banner min-h-[700px] relative w-full bg-gray-900 text-white pt-10 md:pt-20">
      {/* Background Poster */}
      <div className="backdrop-img absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <img
          src={data.poster}
          alt={data.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="opacity-overlay absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-black/90"></div>

      {/* Content */}
      <div className="content max-w-[1200px] mx-auto flex flex-col md:flex-row gap-6 relative px-4 md:px-0">
        {/* Left Poster */}
        <div className="left flex justify-center md:w-1/3">
          <div
            className="posterImg cursor-pointer rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            onClick={() => showBigPoster(data.poster)}
          >
            <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Right Info */}
        <div className="right flex-1 flex flex-col gap-4">
          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <Link to="/home" className="hover:text-primary">Home</Link>
            <span>•</span>
            <Link to={`/animes/${data.type.toLowerCase()}`} className="hover:text-primary">{data.type}</Link>
            <span>•</span>
            <span>{data.title}</span>
          </div>

          {/* Titles */}
          <h1 className="text-3xl md:text-5xl font-extrabold">{data.title}</h1>
          <h2 className="text-lg text-gray-300 font-semibold">{data.alternativeTitle}</h2>
          <h3 className="text-md text-gray-400">{data.japanese}</h3>

          {/* Sounds Info */}
          <div className="sounds flex flex-wrap items-center gap-4 text-sm md:text-base">
            <SoundsInfo episodes={{ rating: data.rating, ...data.episodes }} />
            <span>•</span>
            <span className="capitalize">{data.type}</span>
            <span>•</span>
            <span>{data.duration}</span>
          </div>

          {/* Circle Rating */}
          <div className="circle-rating my-3">
            <CircleRatting rating={data.MAL_score} />
          </div>

          {/* Watch Button */}
          {data.id && (
            <Link to={`/watch/${data.id}`}>
              <button className="flex items-center gap-2 py-2 px-5 bg-primary text-black font-bold rounded-full hover:scale-105 transition-transform duration-300">
                <FaCirclePlay /> Watch Now
              </button>
            </Link>
          )}

          {/* Genres */}
          <div className="genres flex flex-wrap gap-2 mt-3">
            {data.genres.map((genre, index) => (
              <Link key={genre} to={`/animes/genre/${genre.toLowerCase()}`}>
                <span
                  className="px-3 py-1 rounded-full text-black font-semibold cursor-pointer hover:opacity-80 transition"
                  style={{ background: colors[index % colors.length] }}
                >
                  {genre}
                </span>
              </Link>
            ))}
          </div>

          {/* Synopsis */}
          {data.synopsis && (
            <div className="overview mt-4">
              <p className={`text-gray-300 text-sm md:text-base ${showFull ? "line-clamp-none" : "line-clamp-3"}`}>
                {data.synopsis}
              </p>
              <span
                className="text-primary cursor-pointer font-bold"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? "Show Less" : "Read More"}
              </span>
            </div>
          )}

          {/* Status & Aired */}
          <div className="info mt-4 flex flex-wrap gap-6 text-gray-400 text-sm">
            <div>Status: <span className="text-white">{data.status}</span></div>
            <div>
              Aired: <span className="text-white">{data.aired.from}</span>
              {data.aired.to && <> <FaArrowRight className="inline mx-1" /> <span className="text-white">{data.aired.to}</span></>}
            </div>
          </div>

          {/* Studios */}
          {data.studios && (
            <div className="studio mt-3">
              Studio:{" "}
              <Link to={`/producer/${data.studios.toLowerCase().replace(" ", "-")}`} className="text-primary font-semibold">
                {data.studios}
              </Link>
            </div>
          )}

          {/* Producers */}
          {data.producers && data.producers.length > 0 && (
            <div className="producers mt-4">
              <h4 className="font-bold mb-2">Producers</h4>
              <div className="flex flex-wrap gap-2">
                {data.producers.map((producer, index) => (
                  <Link key={producer} to={`/producer/${producer}`}>
                    <span
                      className="px-3 py-1 rounded-full font-semibold cursor-pointer hover:opacity-80 transition"
                      style={{ background: colors[index % colors.length] }}
                    >
                      {producer}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoLayout;
