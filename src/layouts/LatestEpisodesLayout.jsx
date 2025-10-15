import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";

const LatestEpisodesLayout = ({
  title = "Latest Episodes",
  endpoint = "recently-updated",
  data = [],
}) => {
  return (
    <div className="latest-episodes mt-10 px-2 md:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Heading className="text-3xl font-extrabold tracking-wide text-white">
          {title}
        </Heading>

        <Link
          to={`/animes/${endpoint}`}
          className="group flex items-center gap-1 text-sm text-neutral-400 hover:text-sky-400 transition-all"
        >
          <span className="group-hover:underline underline-offset-2">
            View more
          </span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Grid Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.map((item) => {
          // Determine the latest aired episode for each anime
          // Supports data like item.latestEpisode or item.latest_ep or similar
          const latestEp =
            item.latestEpisode || item.latest_ep || item.episodes?.[item.episodes?.length - 1]?.number || item.episode;

          return (
            <Link
              to={`/anime/${item.id}`}
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-[#141414] hover:bg-[#1c1c1c] transition-all duration-300 shadow-md hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative w-full h-0 pb-[60%]">
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>

                {/* ✅ Latest Episode Badge (top-right) */}
                {latestEp && (
                  <div className="absolute top-2 right-2 bg-sky-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Latest Ep {latestEp}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-3">
                <h3
                  title={item.title}
                  className="text-sm md:text-base font-semibold text-gray-200 truncate group-hover:text-sky-400 transition-colors"
                >
                  {item.title}
                </h3>
                {item.genres && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {item.genres.join(" • ")}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LatestEpisodesLayout;
