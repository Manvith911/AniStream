import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Loader from "../components/Loader";

const MainLayout = ({ title, data, label, endpoint }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverDetails, setHoverDetails] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  if (!data || data.length === 0) return null;

  const fetchAnimeDetails = async (id) => {
    if (hoverDetails[id]) return;
    try {
      setLoadingId(id);
      const res = await fetch(`https://animerealm.vercel.app/api/anime/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setHoverDetails((prev) => ({ ...prev, [id]: json.data }));
      }
    } catch (err) {
      console.error("Error fetching anime details:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="main-layout mt-10 px-2 md:px-4 relative z-10">
      {/* Section Heading */}
      <div className="flex justify-between items-center mb-6">
        <Heading className="text-3xl font-extrabold tracking-wide text-white">
          {title}
        </Heading>

        {endpoint && title !== "Trending Now" && (
          <Link
            to={`/animes/${endpoint}`}
            className="text-sm text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 2.4 },
          600: { slidesPerView: 3.5 },
          1024: { slidesPerView: 5 },
          1320: { slidesPerView: 6 },
        }}
        className="overflow-visible"
      >
        {data.map((item) => {
          const anime = {
            id: item.id,
            title: item.title || item.name || "Unknown Title",
            poster: item.poster || item.image || "",
          };

          const details = hoverDetails[anime.id];
          const loading = loadingId === anime.id;

          return (
            <SwiperSlide
              key={anime.id}
              className="!overflow-visible relative z-20"
            >
              <div
                className="relative group flex flex-col items-center px-1 cursor-pointer z-30"
                onMouseEnter={() => {
                  setHoveredId(anime.id);
                  fetchAnimeDetails(anime.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover Info Card */}
                {hoveredId === anime.id && (
                  <div
                    className="absolute left-[110%] top-1/2 -translate-y-1/2 z-50 w-[340px]
                      bg-[#0d0d0d]/95 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl
                      overflow-hidden opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100
                      transition-all duration-300 origin-left"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader />
                      </div>
                    ) : (
                      details && (
                        <div className="flex flex-col">
                          {/* Poster */}
                          <div className="relative w-full h-48 overflow-hidden">
                            <img
                              src={details.image}
                              alt={details.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          </div>

                          {/* Info */}
                          <div className="p-4 flex flex-col gap-2">
                            <h2 className="font-bold text-lg text-white line-clamp-2">
                              {details.title}
                            </h2>

                            {details.genres && (
                              <p className="text-xs text-gray-400 line-clamp-1">
                                {details.genres.join(" • ")}
                              </p>
                            )}

                            {details.synopsis && (
                              <p className="text-sm text-gray-300 line-clamp-3 mt-1">
                                {details.synopsis}
                              </p>
                            )}

                            <Link
                              to={`/watch/${anime.id}`}
                              className="mt-3 bg-gradient-to-r from-sky-500 to-cyan-500
                                text-white text-center py-2 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                              Watch Now
                            </Link>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Anime Card */}
                <Link
                  to={`/anime/${anime.id}`}
                  className="poster relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg
                    transition-transform duration-300 ease-in-out group-hover:scale-[1.05]"
                >
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />

                  {/* Optional Label */}
                  {label && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                      {label}
                    </div>
                  )}
                </Link>

                {/* Title below card */}
                <h2
                  title={anime.title}
                  className="mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none
                    group-hover:text-sky-400 transition-colors"
                >
                  {anime.title}
                </h2>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainLayout;
