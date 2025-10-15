import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";

const LatestEpisodesLayout = ({
  title = "Latest Episodes",
  endpoint = "recently-updated",
  data,
}) => {
  return (
    <div className="latest-episodes mt-12 px-3 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Heading className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
          {title}
        </Heading>

        <Link
          to={`/animes/${endpoint}`}
          className="group flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-sky-400 transition-all"
        >
          <span className="group-hover:underline underline-offset-2">
            View more
          </span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Anime Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data &&
          data.map((item) => (
            <Link
              to={`/anime/${item.id}`}
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-[#161616] hover:bg-[#1e1e1e] transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative w-full h-0 pb-[150%] overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Episode Tag */}
                {item.episode && (
                  <div className="absolute top-2 right-2 bg-sky-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Ep {item.episode}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3
                  title={item.title}
                  className="text-base sm:text-lg font-semibold text-gray-100 truncate group-hover:text-sky-400 transition-colors duration-300"
                >
                  {item.title}
                </h3>
                {item.genres && (
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                    {item.genres.join(" • ")}
                  </p>
                )}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LatestEpisodesLayout;
