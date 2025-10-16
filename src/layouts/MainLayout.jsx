import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const MainLayout = ({ title, data, label, endpoint }) => {
  if (!data || data.length === 0) return null;

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
        className="overflow-visible" // 👈 allow hover card to escape
      >
        {data.map((item) => {
          const anime = {
            id: item.id,
            title: item.title || item.name || "Unknown Title",
            poster: item.poster || item.image || "",
            genres: item.genres || item.tags || [],
            description: item.description || item.synopsis || "",
          };

          return (
            <SwiperSlide key={anime.id} className="!overflow-visible">
              <div className="relative group flex flex-col items-center px-1 cursor-pointer">
                {/* Hover Info Card */}
                <div
                  className="absolute z-50 bottom-full mb-3 w-72 p-4 bg-gray-900/95 text-white rounded-lg shadow-2xl
                    opacity-0 scale-95 pointer-events-none 
                    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                    transition-all duration-300 origin-bottom transform"
                >
                  <h2 className="font-bold text-base mb-1 line-clamp-2">
                    {anime.title}
                  </h2>

                  {anime.genres.length > 0 && (
                    <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                      {anime.genres.join(" • ")}
                    </p>
                  )}

                  {anime.description && (
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {anime.description}
                    </p>
                  )}
                </div>

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
