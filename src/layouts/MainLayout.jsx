import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const MainLayout = ({ title, data, label, endpoint }) => {
  return (
    <div className="main-layout mt-10 px-2 md:px-4">
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
      >
        {data &&
          data.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative group flex flex-col items-center px-1 cursor-pointer">
                {/* Anime Card */}
                <Link
                  to={`/anime/${item.id}`}
                  className="poster relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-[1.05]"
                >
                  {/* Background Image */}
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />

                  {/* Dark overlay with info (appears on hover) */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 rounded-xl translate-y-4 group-hover:translate-y-0">
                    <h2 className="text-white font-semibold text-sm md:text-base mb-1 truncate">
                      {item.title}
                    </h2>

                    {item.genres && (
                      <p className="text-xs text-gray-300 mb-1 truncate">
                        {item.genres.join(" • ")}
                      </p>
                    )}

                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Label (optional) */}
                  {label && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                      {label}
                    </div>
                  )}
                </Link>

                {/* Title below card (optional) */}
                <h2
                  title={item.title}
                  className="mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none group-hover:text-sky-400 transition-colors"
                >
                  {item.title}
                </h2>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MainLayout;
