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

        {/* Show "View More" only if endpoint is provided AND title is not Trending Now */}
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
              <div className="item flex flex-col items-center px-1 group cursor-pointer">
                <Link
                  to={`/anime/${item.id}`}
                  className="poster relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out group-hover:scale-[1.05]"
                >
                  {/* Image */}
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Floating Info (Title + Description) */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out p-3 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
                    <h2
                      className="text-white font-semibold text-sm sm:text-base truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h2>
                    {item.genres && (
                      <p className="text-xs text-gray-300 mt-1 truncate">
                        {item.genres.join(" • ")}
                      </p>
                    )}
                  </div>

                  {/* Label (e.g. Trending / New) */}
                  {label && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                      {label}
                    </div>
                  )}

                  {/* Release Date */}
                  {item.releaseDate && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                      {item.releaseDate}
                    </div>
                  )}
                </Link>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default MainLayout;
