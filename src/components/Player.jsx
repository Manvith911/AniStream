/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";

const Player = ({ episodeId, currentEp, changeEpisode, hasNextEp, hasPrevEp }) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("megaPlay"); // 🔹 Default to megaplay
  const [resumeTime, setResumeTime] = useState(0);

  // Load saved position for this episode
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("playerProgress")) || {};
    if (savedProgress[episodeId]) {
      setResumeTime(savedProgress[episodeId]);
    } else {
      setResumeTime(0);
    }
  }, [episodeId]);

  // Save current timestamp periodically
  const saveProgress = (time) => {
    const savedProgress = JSON.parse(localStorage.getItem("playerProgress")) || {};
    savedProgress[episodeId] = time;
    localStorage.setItem("playerProgress", JSON.stringify(savedProgress));
  };

  const changeCategory = (newType) => {
    if (newType !== category) setCategory(newType);
  };

  const changeServer = (newServer) => {
    if (newServer !== server) setServer(newServer);
  };

  // Optional: simulate "resuming" by adding a `t=` query param (if supported by your player)
  const getIframeSrc = () => {
    const baseUrl =
      server === "vidWish" ? "https://vidwish.live" : "https://megaplay.buzz";
    const epNum = episodeId.split("ep=").pop();
    return `${baseUrl}/stream/s-2/${epNum}/${category}${resumeTime ? `?t=${resumeTime}` : ""}`;
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#181818] rounded-xl shadow-lg overflow-hidden border border-[#242424]">
      {/* Player Frame */}
      <div className="w-full max-w-screen-xl aspect-video bg-black relative rounded-t-xl overflow-hidden">
        <iframe
          src={getIframeSrc()}
          width="100%"
          height="100%"
          allowFullScreen
          className="w-full h-full"
          title="Anime Player"
        ></iframe>
      </div>

      {/* Player Controls */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-[#1f1f1f]/90 px-4 py-3 text-white gap-4 rounded-b-xl border-t border-[#292929]">
        {/* Server Switcher */}
        <div className="flex gap-3">
          <button
            onClick={() => changeServer("vidWish")}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              server === "vidWish"
                ? "bg-[#ff6699] text-black"
                : "bg-[#2a2a2a] text-gray-200 hover:bg-[#343434]"
            }`}
          >
            VidWish
          </button>
          <button
            onClick={() => changeServer("megaPlay")}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              server === "megaPlay"
                ? "bg-[#ff6699] text-black"
                : "bg-[#2a2a2a] text-gray-200 hover:bg-[#343434]"
            }`}
          >
            MegaPlay
          </button>
        </div>

        {/* Category + Episode Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex gap-3">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => changeCategory(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                  category === type
                    ? "bg-[#ff6699] text-black"
                    : "bg-[#2a2a2a] text-gray-200 hover:bg-[#343434]"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {hasPrevEp && (
              <button
                title="Previous Episode"
                className="bg-[#ff6699] hover:bg-[#ff7bab] text-black px-2.5 py-1.5 rounded-md transition"
                onClick={() => changeEpisode("prev")}
              >
                <TbPlayerTrackPrevFilled size={18} />
              </button>
            )}
            {hasNextEp && (
              <button
                title="Next Episode"
                className="bg-[#ff6699] hover:bg-[#ff7bab] text-black px-2.5 py-1.5 rounded-md transition"
                onClick={() => changeEpisode("next")}
              >
                <TbPlayerTrackNextFilled size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Episode Info */}
        <div className="flex flex-col text-center sm:text-right text-sm">
          <p className="text-gray-400">
            You are watching <span className="text-white font-medium">Episode {currentEp.episodeNumber}</span>
          </p>
          {currentEp.isFiller && (
            <p className="text-[#ff6b6b]">You are watching a filler episode 👻</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
