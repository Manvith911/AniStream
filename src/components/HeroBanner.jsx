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
      speed={250}
      grabCursor={true}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation={true}
      // ✅ Added responsive top padding to prevent header overlap
      className="slider pt-[70px] sm:pt-[80px] md:pt-[90px] mb-5 h-[40vh] sm:h-[40vh] md:h-[50vh] xl:h-[calc(100vh-300px)]"
    >
      {slides &&
        slides.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative h-full overflow-hidden bg-backGround"
          >
            <div className="content w-full h-full">
              {/* Background image */}
              <div className="opacity-layer absolute left-0 md:left-[15%] xl:left-[30%] top-0 right-0 bottom-0 overflow-hidden">
                <img
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  alt={item.title}
                  src={item.poster}
                />
                {/* Optional darker overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Text Content */}
              <div className="z-10 ml-2 md:ml-12 min-w-32 md:max-w-2xl absolute bottom-0 sm:bottom-[30px]">
                <div className="text-primary text-base font-semibold mb-2">
                  #{item.rank} Spotlight
                </div>

                <div
                  title={item.title}
                  className="title text-lg md:text-2xl xl:text-5xl font-bold mb-6 line-clamp-2"
                >
                  {item.title}
                </div>

                {/* Info Row */}
                <div className="text-base text-white mb-3 gap-5 hidden md:flex">
                  <div className="item flex items-center gap-1">
                    <FaCirclePlay />
                    <span>{item.type}</span>
                  </div>
                  <div className="item flex items-center gap-1">
                    <FaClock />
                    <span>{item.duration}</span>
                  </div>
                  <div className="item flex items-center gap-1">
                    <FaCalendarDay />
                    <span>{item.aired}</span>
                  </div>
                  <div className="item bg-primary text-black text-sm font-bold px-2 rounded-sm">
                    <span>{item.quality}</span>
                  </div>
                  <div className="item">
                    <SoundsInfo episodes={item.episodes} />
                  </div>
                </div>

                {/* Synopsis */}
                <div className="synopsis text-sm md:text-base line-clamp-3 text-gray-200">
                  {item.synopsis}
                </div>

                {/* ✅ Buttons Section (larger & responsive) */}
                <div className="desi-buttons z-50 text-base md:text-lg mt-6 flex gap-3">
                  <Link
                    to={`/watch/${item.id}`}
                    className="bg-primary rounded-full px-6 py-2 md:px-8 md:py-3 text-black flex justify-center items-center gap-2 font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    <FaCirclePlay className="text-lg md:text-xl" />
                    <span>Watch Now</span>
                  </Link>
                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-btnbg rounded-full px-6 py-2 md:px-8 md:py-3 flex justify-center items-center gap-2 font-semibold hover:scale-105 transition-transform duration-200"
                  >
                    <span>Detail</span>
                    <FaAngleRight className="text-lg md:text-xl" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default HeroBanner;
