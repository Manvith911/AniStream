import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";

const TrendingLayout = ({ data }) => {
  return (
    <div className="trending mt-5">
      <Heading className="mb-2">Trending</Heading>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        breakpoints={{
          0: { slidesPerView: 3.2 },      // Slight overflow for a carousel effect
          600: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1320: { slidesPerView: 6 },
        }}
      >
        {data &&
          data.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="item flex flex-col items-center overflow-hidden px-1 md:px-1.5">
                <Link
                  to={`/anime/${item.id}`}
                  className="poster w-full max-w-[130px] h-0 pb-[140%] bg-lightbg relative overflow-hidden rounded-md shadow-sm"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    src={item.poster}
                    alt={item.title}
                  />
                  <div className="rank p-1 text-xs md:text-sm font-bold absolute top-0 left-0 bg-white text-black">
                    0{item.rank}
                  </div>
                </Link>
                <h2
                  title={item.title}
                  className="title cursor-default text-xs sm:text-sm font-medium text-center truncate w-full mt-1"
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
