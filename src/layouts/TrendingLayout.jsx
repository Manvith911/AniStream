import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TrendingLayout = ({ data }) => {
  return (
    <div className="trending mt-8 px-2 md:px-4">
      <Heading className="mb-6 text-3xl font-extrabold tracking-wide text-gray-900">
        Trending
      </Heading>
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
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-opacity duration-300 rounded-xl"></div>
                  <div className="rank absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                    #{item.rank.toString().padStart(2, "0")}
                  </div>
                </Link>
                <h2
                  title={item.title}
                  className="title mt-3 text-center text-gray-800 font-semibold text-base truncate w-full select-none"
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

export default TrendingLayout;
