import {
  FaAngleRight,
  FaCalendarDay,
  FaCirclePlay,
  FaClock,
} from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import "./hero.css";
import SoundsInfo from "./SoundsInfo";
import { Link } from "react-router-dom";

const HeroBanner = ({ slides }) => {
  return (
    <Swiper
      speed={600}
      grabCursor={true}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={true}
      className="slider relative h-[45vh] sm:h-[55vh] md:h-[70vh] xl:h-[calc(100vh-180px)] rounded-2xl overflow-hidden"
    >
      {slides?.map((item) => (
        <SwiperSlide
          key={item.id}
          className="relative w-full h-full bg-backGround flex items-end"
        >
          {/* Background Image with gradient overlay */}
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-[3000ms] ease-out"
              loading="lazy"
              alt={item.title}
              src={item.poster}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 px-6 sm:px-12 md:px-16 xl:px-32 pb-10 sm:pb-16 max-w-3xl text-white">
            <div className="text-primary text-base sm:text-lg font-semibold mb-2 tracking-wide">
              #{item.rank} Spotlight
            </div>

            <h2
              title={item.title}
              className="text-2xl sm:text-4xl xl:text-6xl font-extrabold mb-4 leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] line-clamp-2"
            >
              {item.title}
            </h2>

            <div className="text-sm sm:text-base text-gray-200 mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                <FaCirclePlay className="text-primary" />
                <span>{item.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-primary" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarDay className="text-primary" />
                <span>{item.aired}</span>
              </div>
              <div className="bg-primary text-black text-xs sm:text-sm font-bold px-2 py-[2px] rounded">
                {item.quality}
              </div>
              <SoundsInfo episodes={item.episodes} />
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              {item.synopsis}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm sm:text-base">
              <Link
                to={`/watch/${item.id}`}
                className="bg-primary text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2 hover:brightness-90 transition-all duration-200 shadow-md"
              >
                <FaCirclePlay />
                <span>Watch Now</span>
              </Link>
              <Link
                to={`/anime/${item.id}`}
                className="bg-white/10 text-white border border-white/20 px-6 py-2 rounded-full flex items-center gap-2 font-semibold hover:bg-white/20 transition-all duration-200"
              >
                <span>Details</span>
                <FaAngleRight />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroBanner;
