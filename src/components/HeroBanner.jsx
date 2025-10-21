import { FaAngleRight, FaCalendarDay, FaCirclePlay, FaClock } from "react-icons/fa6";
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
  const MetaItem = ({ icon: Icon, text, extraClasses }) => (
    <div className={`item flex items-center gap-1 ${extraClasses || ""}`}>
      <Icon /> <span>{text}</span>
    </div>
  );

  const ActionButton = ({ to, children, icon, primary }) => (
    <Link
      to={to}
      className={`flex justify-center items-center gap-2 px-6 py-2 rounded-3xl font-semibold transition-all duration-200 hover:brightness-90 ${
        primary ? "bg-primary text-black" : "bg-btnbg text-white"
      }`}
    >
      {icon && icon} {children}
    </Link>
  );

  return (
    <Swiper
      speed={250}
      grabCursor
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      navigation
      className="slider h-[40vh] pt-10 mb-5 sm:h-[40vh] md:h-[50vh] xl:h-[calc(100vh-300px)]"
    >
      {slides?.map((item) => (
        <SwiperSlide
          key={item.id}
          className="relative h-full overflow-hidden bg-backGround"
        >
          <div className="content w-full h-full relative">
            {/* Background image with overlay */}
            <div className="opacity-layer absolute left-0 md:left-[15%] xl:left-[30%] top-0 right-0 bottom-0 overflow-hidden">
              <img
                src={item.poster}
                alt={item.title}
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Info container */}
            <div className="z-10 ml-2 md:ml-12 min-w-32 md:max-w-2xl absolute bottom-8 sm:bottom-[40px]">
              {/* Spotlight rank */}
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

              {/* Meta info */}
              <div className="text-base text-white mb-3 gap-5 hidden md:flex flex-wrap">
                <MetaItem icon={FaCirclePlay} text={item.type} />
                <MetaItem icon={FaClock} text={item.duration} />
                <MetaItem icon={FaCalendarDay} text={item.aired} />
                <MetaItem
                  text={item.quality}
                  extraClasses="bg-primary text-black text-sm font-bold px-2 rounded-sm"
                />
                <MetaItem
                  text={<SoundsInfo episodes={item.episodes} />}
                />
              </div>

              {/* Synopsis */}
              {item.synopsis && (
                <div className="synopsis text-white text-sm md:text-base line-clamp-3">
                  {item.synopsis}
                </div>
              )}

              {/* Action buttons */}
              <div className="desi-buttons z-50 text-base md:text-lg mt-6 flex gap-3">
                <ActionButton
                  to={`/watch/${item.id}`}
                  icon={<FaCirclePlay />}
                  primary
                >
                  Watch Now
                </ActionButton>
                <ActionButton to={`/anime/${item.id}`}>
                  Detail <FaAngleRight />
                </ActionButton>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroBanner;
