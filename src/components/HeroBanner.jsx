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
    <div id="slider" className="relative w-full">
      <Swiper
        speed={700}
        grabCursor={true}
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-[45vh] sm:h-[55vh] md:h-[70vh] xl:h-[calc(100vh-180px)] overflow-hidden"
      >
        {slides?.map((item) => (
          <SwiperSlide key={item.id} className="swiper-slide relative">
            {/* Blurred cover background */}
            <div className="deslide-cover-img absolute inset-0">
              <img
                src={item.poster}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gradient overlay */}
            <div className="opacity-layer" />

            {/* Overlay gradient (matches your CSS) */}
            <div className="deslide-cover" />

            {/* Text content */}
            <div className="deslide-item-content deslide-item">
              <div className="desi-sub-text">#{item.rank} Spotlight</div>
              <div className="desi-head-title">{item.title}</div>

              <div className="sc-detail flex flex-wrap gap-3 items-center">
                <div className="item">
                  <FaCirclePlay />
                  <span>{item.type}</span>
                </div>
                <div className="item">
                  <FaClock />
                  <span>{item.duration}</span>
                </div>
                <div className="item">
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

              <div className="desi-description">{item.synopsis}</div>

              <div className="desi-buttons flex gap-3 mt-6 flex-wrap">
                <Link
                  to={`/watch/${item.id}`}
                  className="bg-[#ff6584] hover:brightness-90 text-black font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-200 shadow-lg"
                >
                  <FaCirclePlay />
                  <span>Watch Now</span>
                </Link>
                <Link
                  to={`/anime/${item.id}`}
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-semibold px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-200"
                >
                  <span>Detail</span>
                  <FaAngleRight />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;
