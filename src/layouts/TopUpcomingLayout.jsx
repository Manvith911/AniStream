import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TopUpcomingLayout = ({ data }) => {
  return (
    <div className="top-upcoming mt-10 px-2 md:px-4">
      {/* Section Heading */}
      <Heading className="mb-6 text-3xl font-extrabold tracking-wide text-white">
        Top Upcoming
      </Heading>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={14}
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
                  className="poster relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out group-hover:scale-[1.04]"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Label */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                    Upcoming
                  </div>

                  {/* Release Date (optional) */}
                  {item.releaseDate && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                      {item.releaseDate}
                    </div>
                  )}
                </Link>

                {/* Title */}
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

export default TopUpcomingLayout;
