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
      className="slider h-[40vh] pt-10 mb-5 sm:h-[50vh] md:h-[60vh] xl:h-[calc(100vh-300px)]"
    >
      {slides &&
        slides.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative h-full overflow-hidden bg-backGround"
          >
            <div className="content w-full h-full">
              {/* Image with enhanced opacity layer */}
              <div className="opacity-layer absolute left-0 md:left-[15%] xl:left-[30%] top-0 right-0 bottom-0 overflow-hidden">
                <img
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                  alt={item.title}
                  src={item.poster}
                />
              </div>

              {/* Text and buttons section */}
              <div className="z-10 ml-2 md:ml-12 min-w-32 md:max-w-2xl absolute bottom-8 sm:bottom-[40px] flex flex-col justify-between h-full">
                {/* Spotlight Ranking */}
                <div className="text-primary text-base font-semibold mb-2">
                  #{item.rank} Spotlight
                </div>
                
                {/* Title */}
                <div
                  title={item.title}
                  className="title text-lg md:text-2xl xl:text-5xl font-bold mb-6 line-clamp-2"
                >
                  {item.title}
                </div>

                {/* Info Section */}
                <div className="text-base text-white mb-3 gap-5 hidden md:flex">
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

                {/* Synopsis */}
                <div className="synopsis text-white text-sm md:text-base line-clamp-3 mb-4">
                  {item.synopsis}
                </div>

                {/* Buttons */}
                <div className="desi-buttons z-50 text-base md:text-lg mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/watch/${item.id}`}
                    className="bg-primary rounded-3xl px-6 py-2 text-black flex justify-center items-center gap-2 font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
                  >
                    <FaCirclePlay />
                    <span>Watch Now</span>
                  </Link>
                  <Link
                    to={`/anime/${item.id}`}
                    className="bg-btnbg rounded-3xl px-6 py-2 flex justify-center items-center gap-2 font-semibold transition-all duration-200 hover:brightness-90 hover:scale-105"
                  >
                    <span>Detail</span>
                    <FaAngleRight />
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
