/* eslint-disable react/prop-types */
import { useState } from "react";
import SoundsInfo from "../components/SoundsInfo";
import { Link } from "react-router-dom";
import { FaCirclePlay, FaArrowRight } from "react-icons/fa6";
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
    <section className="relative min-h-[700px] w-full text-white overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={data.poster}
          alt={data.title}
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col md:flex-row gap-10 items-start">
        {/* Left: Poster */}
        <div className="flex justify-center md:w-[35%]">
          <div
            onClick={() => showBigPoster(data.poster)}
            className="rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
          >
            <img
              src={data.poster}
              alt={data.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col gap-5 md:gap-6">
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <Link to="/home" className="hover:text-primary">
              Home
            </Link>
            <span>•</span>
            <Link
              to={`/animes/${data.type.toLowerCase()}`}
              className="hover:text-primary capitalize"
            >
              {data.type}
            </Link>
            <span>•</span>
            <span className="text-gray-300">{data.title}</span>
          </div>

          {/* Titles */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              {data.title}
            </h1>
            {data.alternativeTitle && (
              <h2 className="text-lg text-gray-300 font-medium italic">
                {data.alternativeTitle}
              </h2>
            )}
            {data.japanese && (
              <h3 className="text-sm text-gray-500 mt-1">{data.japanese}</h3>
            )}
          </div>

          {/* Rating & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <SoundsInfo episodes={{ rating: data.rating, ...data.episodes }} />
            <span>•</span>
            <span className="capitalize">{data.type}</span>
            <span>•</span>
            <span>{data.duration}</span>
          </div>

          {/* Circle Rating (smaller now) */}
          <div className="mt-2 w-[70px] h-[70px] flex items-center justify-center overflow-hidden">
            <CircleRatting rating={data.MAL_score} size={70} />
          </div>

          {/* Watch Button */}
          {data.id && (
            <Link to={`/watch/${data.id}`} className="mt-2">
              <button className="flex items-center gap-2 py-3 px-6 bg-primary text-black font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all duration-300">
                <FaCirclePlay className="text-xl" /> Watch Now
              </button>
            </Link>
          )}

          {/* Genres */}
          {data.genres && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.genres.map((genre, index) => (
                <Link key={genre} to={`/animes/genre/${genre.toLowerCase()}`}>
                  <span
                    className="px-3 py-1 text-black text-sm font-semibold rounded-full hover:scale-105 transition-transform"
                    style={{ background: colors[index % colors.length] }}
                  >
                    {genre}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {data.synopsis && (
            <div className="mt-4">
              <p
                className={`text-gray-300 leading-relaxed text-sm md:text-base ${
                  showFull ? "" : "line-clamp-3"
                }`}
              >
                {data.synopsis}
              </p>
              <button
                onClick={() => setShowFull(!showFull)}
                className="mt-2 text-primary font-bold hover:underline"
              >
                {showFull ? "Show Less" : "Read More"}
              </button>
            </div>
          )}

          {/* Status & Aired */}
          <div className="mt-4 flex flex-wrap gap-6 text-gray-400 text-sm">
            <div>
              Status:{" "}
              <span className="text-white font-medium">{data.status}</span>
            </div>
            <div>
              Aired:{" "}
              <span className="text-white font-medium">{data.aired.from}</span>
              {data.aired.to && (
                <>
                  {" "}
                  <FaArrowRight className="inline mx-1 text-xs" />{" "}
                  <span className="text-white font-medium">
                    {data.aired.to}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Studios */}
          {data.studios && (
            <div className="mt-3">
              <span className="text-gray-400">Studio:</span>{" "}
              <Link
                to={`/producer/${data.studios
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="text-primary font-semibold hover:underline"
              >
                {data.studios}
              </Link>
            </div>
          )}

          {/* Producers */}
          {data.producers && data.producers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold mb-2 text-gray-200">Producers</h4>
              <div className="flex flex-wrap gap-2">
                {data.producers.map((producer, index) => (
                  <Link key={producer} to={`/producer/${producer}`}>
                    <span
                      className="px-3 py-1 rounded-full font-semibold text-sm cursor-pointer hover:scale-105 transition-transform"
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
    </section>
  );
};

export default InfoLayout;
