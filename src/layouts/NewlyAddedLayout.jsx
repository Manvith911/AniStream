import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import Heading from "../components/Heading";

import "swiper/css";
import "swiper/css/navigation";

const NewlyAddedLayout = ({ title = "Newly Added", endpoint = "recently-added", data }) => {
  return (
    <div className="newly-added mt-10 px-2 md:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Heading className="text-3xl font-extrabold tracking-wide text-white">
          {title}
        </Heading>
        <Link
          to={`/animes/${endpoint}`}
          className="group flex items-center gap-1 text-sm text-neutral-400 hover:text-pink-400 transition-all"
        >
          <span className="group-hover:underline underline-offset-2">
            View more
          </span>
          <FaAngleRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={12}
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
                  className="poster relative w-full h-0 pb-[140%] rounded-xl shadow-lg overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105"
                >
                  {/* Poster Image */}
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-xl"></div>

                  {/* Episode Tag */}
                  {item.episode && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md select-none">
                      Ep {item.episode}
                    </div>
                  )}
                </Link>

                {/* Title */}
                <h2
                  title={item.title}
                  className="title mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none group-hover:text-pink-400 transition-colors"
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

export default NewlyAddedLayout;
