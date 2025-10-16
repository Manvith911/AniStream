import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import Loader from "../components/Loader";

const MainLayout = ({ title, data, label, endpoint }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverDetails, setHoverDetails] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  if (!data || data.length === 0) return null;

  const visibleData =
    title === "Top Upcoming" || title === "Newly Added"
      ? data.slice(0, 10)
      : data;

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
    // small debounce to avoid too many quick fetches
    fetchAnimeDetails(id);
  };

  const handleMouseLeave = () => {
    // small delay so user can move into the hover card
    hoverTimeoutRef.current = setTimeout(() => setHoveredId(null), 150);
  };

  const handleHoverCardEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleHoverCardLeave = () => setHoveredId(null);

  const handleCardClick = (id) => {
    navigate(`/anime/${id}`);
  };

  return (
    <div className="main-layout mt-10 px-2 md:px-4 relative z-0 isolate w-full max-w-full overflow-hidden">
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

      <div className="relative overflow-visible">
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
                  onClick={() => handleCardClick(anime.id)}
                >
                  <div className="relative w-full h-0 pb-[140%] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-[1.05]">
                    <img
                      src={anime.poster}
                      alt={anime.title || "Anime poster"}
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

                  <h2
                    title={anime.title}
                    className="mt-3 text-center text-gray-300 font-semibold text-base truncate w-full select-none group-hover:text-sky-400 transition-colors"
                  >
                    {anime.title}
                  </h2>

                  {/* HOVER CARD: rendered only when hovered (isHovered) to avoid accidental blocking */}
                  {isHovered && (
                    <div
                      onMouseEnter={handleHoverCardEnter}
                      onMouseLeave={handleHoverCardLeave}
                      // NOTE: don't use group-hover classes here — visibility controlled by state
                      className={
                        // fixed set of classes (avoid bracketed z if Tailwind purges it)
                        "absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[340px] bg-[#1b1b1d]/95 backdrop-blur-xl border border-gray-800/70 rounded-2xl shadow-2xl overflow-hidden z-50 pointer-events-auto transition-all duration-300 transform opacity-100 scale-100"
                      }
                      style={{ transformOrigin: "top center" }}
                    >
                      {loading ? (
                        <div className="flex justify-center items-center h-52">
                          <Loader />
                        </div>
                      ) : (
                        details && (
                          <div className="p-4 flex flex-col gap-3 text-white">
                            {/* Title */}
                            <h2 className="font-bold text-lg text-white truncate">
                              {details.title}
                            </h2>

                            {/* Info badges */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {details.score && (
                                <span className="flex items-center bg-gray-800/70 px-2 py-0.5 rounded-full text-yellow-400">
                                  ⭐ {details.score}
                                </span>
                              )}
                              <span className="bg-green-600/80 text-white px-2 py-0.5 rounded-md font-semibold">
                                HD
                              </span>
                              {details.type && (
                                <span className="bg-gray-800/80 text-gray-200 px-2 py-0.5 rounded-md">
                                  {details.type}
                                </span>
                              )}
                              {details.status && (
                                <span className="bg-gray-800/80 text-gray-300 px-2 py-0.5 rounded-md">
                                  {details.status}
                                </span>
                              )}
                            </div>

                            {/* Synopsis */}
                            {details.synopsis && (
                              <p className="text-sm text-gray-300 leading-snug line-clamp-3">
                                {details.synopsis}
                              </p>
                            )}

                            {/* Extra info */}
                            <div className="text-xs text-gray-400 mt-1 space-y-1">
                              {details.japanese && (
                                <p>
                                  <span className="font-semibold text-gray-300">
                                    Japanese:
                                  </span>{" "}
                                  {details.japanese}
                                </p>
                              )}
                              {details.synonyms &&
                                details.synonyms.length > 0 && (
                                  <p>
                                    <span className="font-semibold text-gray-300">
                                      Synonyms:
                                    </span>{" "}
                                    {details.synonyms.join(", ")}
                                  </p>
                                )}
                              {details.genres && (
                                <p>
                                  <span className="font-semibold text-gray-300">
                                    Genres:
                                  </span>{" "}
                                  {details.genres.join(", ")}
                                </p>
                              )}
                            </div>

                            {/* Watch Now Button */}
                            {title !== "Top Upcoming" && (
                              <Link
                                to={`/watch/${anime.id}`}
                                className="mt-3 w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>🎬 Watch now</span>
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
    </div>
  );
};

export default MainLayout;
