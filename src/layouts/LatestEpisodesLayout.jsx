import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";

const LatestEpisodesLayout = ({
  title = "Latest Episodes",
  viewMoreUrl = "/animes/recently-updated",
  data,
}) => {
  return (
    <div className="latest-episodes mt-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Heading className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
          {title}
        </Heading>

        <Link
          to={viewMoreUrl}
          className="group flex items-center gap-1 text-sm font-medium text-neutral-400 hover:text-sky-400 transition-all"
        >
          <span className="group-hover:underline underline-offset-2">
            View more
          </span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Anime Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data &&
          data.map((item) => {
            // ✅ Determine latest available episode number and id
            const latestEpNum =
              item.episodes?.sub > 0 ? item.episodes.sub : item.episodes?.dub || 1;

            // ✅ Build link to proper episode (same as your WatchPage expects)
            const latestEpId = item.episodeId || item.latestEpId || item.id; // fallback if your API gives it
            const link = `/watch/${item.id}?ep=${latestEpId || latestEpNum}`;

            // ✅ Avoid duplicate title line if same as alternative
            const showAltTitle =
              item.alternativeTitle &&
              item.alternativeTitle !== item.title;

            return (
              <Link
                key={item.id}
                to={link}
                className="group relative rounded-xl overflow-hidden bg-[#111] hover:bg-[#181818] transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative w-full h-0 pb-[60%] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Episode Tag */}
                  <div className="absolute top-2 right-2 bg-sky-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Episode {latestEpNum}
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3
                    title={item.title}
                    className="text-base sm:text-lg font-semibold text-gray-100 truncate group-hover:text-sky-400 transition-colors duration-300"
                  >
                    {item.title}
                  </h3>

                  {showAltTitle && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                      {item.alternativeTitle}
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
