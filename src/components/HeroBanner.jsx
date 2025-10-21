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
      className="slider h-[45vh] sm:h-[50vh] md:h-[60vh] xl:h-[calc(100vh-250px)] relative rounded-2xl overflow-hidden"
    >
      {slides?.map((item) => (
        <SwiperSlide key={item.id} className="relative group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
              loading="lazy"
              src={item.poster}
              alt={item.title}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-10 left-5 sm:left-10 md:left-[10%] xl:left-[25%] max-w-3xl text-white z-20">
            <div className="text-primary text-sm sm:text-base font-semibold mb-2 tracking-wide drop-shadow">
              #{item.rank} Spotlight
            </div>

            <h2
              title={item.title}
              className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg"
            >
              {item.title}
            </h2>

            {/* Anime Info Row */}
            <div className="hidden md:flex flex-wrap gap-5 text-sm text-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <FaCirclePlay className="text-primary" />
                <span>{item.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-primary" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarDay className="text-primary" />
                <span>{item.aired}</span>
              </div>
              <div className="bg-primary text-black text-xs font-bold px-2 py-1 rounded-sm">
                {item.quality}
              </div>
              <SoundsInfo episodes={item.episodes} />
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-gray-200 line-clamp-3 opacity-90">
              {item.synopsis}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to={`/watch/${item.id}`}
                className="bg-primary text-black rounded-full px-6 py-2 flex items-center gap-2 font-semibold shadow-md hover:brightness-90 hover:scale-105 transition-all duration-200"
              >
                <FaCirclePlay />
                <span>Watch Now</span>
              </Link>

              <Link
                to={`/anime/${item.id}`}
                className="bg-btnbg text-white rounded-full px-6 py-2 flex items-center gap-2 font-semibold shadow-md hover:bg-btnbg/80 hover:scale-105 transition-all duration-200"
              >
                <span>Detail</span>
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
