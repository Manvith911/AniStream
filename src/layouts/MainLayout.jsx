import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Loader from "../components/Loader";
import HoverCardPortal from "../components/HoverCardPortal";

const MainLayout = ({ title, data, label, endpoint }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverDetails, setHoverDetails] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef({});

  if (!data || data.length === 0) return null;

  const fetchAnimeDetails = async (id) => {
    if (hoverDetails[id]) return;
    try {
      setLoadingId(id);
      const res = await fetch(`https://animerealm.vercel.app/api/anime/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setHoverDetails((prev) => ({ ...prev, [id]: json.data }));
      }
    } catch (err) {
      console.error("Error fetching anime details:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    fetchAnimeDetails(id);

    const rect = cardRefs.current[id]?.getBoundingClientRect();
    const hoverCardWidth = 340;
    const padding = 12;
    const screenWidth = window.innerWidth;

    if (rect) {
      const spaceOnRight = screenWidth - rect.right;
      const x =
        spaceOnRight > hoverCardWidth + padding
          ? rect.right + padding
          : rect.left - hoverCardWidth - padding;

      setHoverPosition({
        x,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  return (
    <div className="main-layout mt-10 px-2 md:px-4 relative z-10">
      {/* Section Heading */}
      <div className="flex justify-between items-center mb-6">
        <Heading className="text-3xl font-extrabold tracking-wide text-white">
          {title}
        </Heading>

        {endpoint && title !== "Trending Now" && (
          <Link
            to={`/animes/${endpoint}`}
            className="text-sm text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 2.4 },
          600: { slidesPerView: 3.5 },
          1024: { slidesPerView: 5 },
          1320: { slidesPerView: 6 },
        }}
        className="overflow-visible"
      >
        {data.map((item) => {
          const anime = {
            id: item.id,
            title: item.title || item.name || "Unknown Title",
            poster: item.poster || item.image || "",
          };

          const details = hoverDetails[anime.id];
          const loading = loadingId === anime.id;

          return (
            <SwiperSlide
              key={anime.id}
              className="!overflow-visible relative z-10"
            >
              <div
                ref={(el) => (cardRefs.current[anime.id] = el)}
                className="relative group flex flex-col items-center px-1 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(anime.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Anime Card */}
                <Link
                  to={`/anime/${anime.id}`}
                  className="poster relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-[1.05]"
                >
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  {label && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                      {label}
                    </div>
                  )}
                </Link>

                {/* Title below card */}
                <h2
                  title={anime.title}
                  className="mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none group-hover:text-sky-400 transition-colors"
                >
                  {anime.title}
                </h2>
              </div>

              {/* Hover Card */}
              {hoveredId === anime.id && (
                <HoverCardPortal>
                  <div
                    style={{
                      position: "fixed",
                      top: `${hoverPosition.y}px`,
                      left: `${hoverPosition.x}px`,
                      transform: "translateY(-50%)",
                      zIndex: 9999,
                    }}
                    className="w-[340px] max-w-[calc(100vw-20px)] bg-[#1f1f1f]/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-xl overflow-hidden text-sm text-gray-300"
                  >
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader />
                      </div>
                    ) : details ? (
                      <div className="flex flex-col">
                        {/* Image */}
                        <div className="relative w-full h-44 overflow-hidden">
                          <img
                            src={details.image}
                            alt={details.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <h2 className="text-lg font-bold text-white leading-snug line-clamp-2">
                            {details.title}
                          </h2>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-yellow-400">⭐ {details.rating || "N/A"}</span>
                            {details.type && (
                              <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-medium">
                                {details.type}
                              </span>
                            )}
                          </div>

                          {details.synopsis && (
                            <p className="text-gray-400 text-sm line-clamp-3">
                              {details.synopsis}
                            </p>
                          )}

                          <div className="text-xs text-gray-400 space-y-1">
                            {details.japanese && (
                              <p><span className="text-gray-500">Japanese:</span> {details.japanese}</p>
                            )}
                            {details.aired && (
                              <p><span className="text-gray-500">Aired:</span> {details.aired}</p>
                            )}
                            {details.status && (
                              <p><span className="text-gray-500">Status:</span> {details.status}</p>
                            )}
                            {details.genres && (
                              <p><span className="text-gray-500">Genres:</span> {details.genres.join(", ")}</p>
                            )}
                          </div>

                          <Link
                            to={`/watch/${anime.id}`}
                            className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-full hover:opacity-90 transition"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 4l10 6-10 6V4z" />
                            </svg>
                            Watch now
                          </Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </HoverCardPortal>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainLayout;
