import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import Loader from "../components/Loader";

const MainLayout = ({ title, data, label, endpoint }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverDetails, setHoverDetails] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  if (!data || data.length === 0) return null;

  // ✨ Limit for specific sections
  const visibleData =
    title === "Top Upcoming" || title === "Newly Added"
      ? data.slice(0, 10)
      : data;

  // Fetch anime info for hover
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
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredId(id);
    fetchAnimeDetails(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredId(null), 150);
  };

  const handleHoverCardEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleHoverCardLeave = () => setHoveredId(null);

  return (
    <div className="main-layout mt-10 px-2 md:px-4 relative z-0 isolate w-full max-w-full overflow-hidden">
      {/* Heading + View More */}
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

      {/* Anime Swiper */}
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
        className="overflow-visible relative z-0"
        style={{ maxWidth: "100%" }}
      >
        {visibleData.map((item) => {
          const anime = {
            id: item.id,
            title: item.title || item.name || "Unknown Title",
            poster: item.poster || item.image || "",
          };

          const details = hoverDetails[anime.id];
          const loading = loadingId === anime.id;
          const isHovered = hoveredId === anime.id;

          return (
            <SwiperSlide
              key={anime.id}
              className="!overflow-visible relative z-0"
            >
              <div
                className="relative group flex flex-col items-center px-1 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(anime.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Poster card */}
                <div className="relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-[1.05]">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-all duration-300 ${
                      isHovered ? "blur-sm brightness-75" : ""
                    }`}
                  />

                  {label && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md select-none">
                      {label}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2
                  title={anime.title}
                  className="mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none group-hover:text-sky-400 transition-colors"
                >
                  {anime.title}
                </h2>

                {/* Hover Card — beside poster */}
                {isHovered && (
                  <div
                    onMouseEnter={handleHoverCardEnter}
                    onMouseLeave={handleHoverCardLeave}
                    className="absolute top-1/2 left-full ml-3 -translate-y-1/2 w-[320px] bg-[#0b0b0c]/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-20 pointer-events-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ease-out"
                    style={{ transformOrigin: "left center" }}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center h-52">
                        <Loader />
                      </div>
                    ) : (
                      details && (
                        <div className="p-4 flex flex-col gap-2">
                          <h2 className="font-bold text-lg text-white line-clamp-2">
                            {details.title}
                          </h2>

                          <div className="flex items-center gap-2">
                            {details.score && (
                              <span className="text-yellow-400 text-sm">
                                ⭐ {details.score}
                              </span>
                            )}
                            {details.type && (
                              <span className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded">
                                {details.type}
                              </span>
                            )}
                            {details.status && (
                              <span className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded">
                                {details.status}
                              </span>
                            )}
                          </div>

                          {details.genres && (
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {details.genres.join(" • ")}
                            </p>
                          )}

                          {details.synopsis && (
                            <p className="text-sm text-gray-300 line-clamp-3 mt-1">
                              {details.synopsis}
                            </p>
                          )}

                          {/* Hide watch for Top Upcoming */}
                          {title !== "Top Upcoming" && (
                            <Link
                              to={`/watch/${anime.id}`}
                              className="mt-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-center py-2 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                              Watch Now
                            </Link>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainLayout;
