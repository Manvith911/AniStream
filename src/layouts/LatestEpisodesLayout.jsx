import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";

const LatestEpisodesLayout = ({
  title = "Latest Episodes",
  viewMoreUrl = "/animes/recently-updated",
  data,
}) => {
  const [latestIds, setLatestIds] = useState({});

  useEffect(() => {
    const fetchLatestIds = async () => {
      const newIds = {};
      for (const item of data || []) {
        try {
          const res = await fetch(
            `https://www.animerealm.in/api/episodes/${item.id}`
          );
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            const lastEp = json.data[json.data.length - 1];
            // extract numeric ID
            const epId = lastEp.id.split("ep=").pop();
            newIds[item.id] = {
              epId,
              epNum: lastEp.episodeNumber,
            };
          }
        } catch (err) {
          console.error("Error fetching episodes for", item.id, err);
        }
      }
      setLatestIds(newIds);
    };

    fetchLatestIds();
  }, [data]);

  return (
    <div className="latest-episodes mt-12 px-4 md:px-8">
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

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data?.map((item) => {
          const info = latestIds[item.id];
          const watchUrl = info
            ? `/watch/${item.id}?ep=${info.epId}`
            : `/anime/${item.id}`;

          return (
            <Link
              key={item.id}
              to={watchUrl}
              className="group relative rounded-xl overflow-hidden bg-[#111] hover:bg-[#181818] transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <div className="relative w-full h-0 pb-[60%] overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300"></div>

                {info && (
                  <div className="absolute top-2 right-2 bg-sky-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    Episode {info.epNum}
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3
                  title={item.title}
                  className="text-base sm:text-lg font-semibold text-gray-100 truncate group-hover:text-sky-400 transition-colors duration-300"
                >
                  {item.title}
                </h3>
                {item.alternativeTitle &&
                  item.alternativeTitle !== item.title && (
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
