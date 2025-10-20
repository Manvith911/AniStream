/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import loaderGif from "../assets/loader.gif";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("megaPlay"); // Default to MegaPlay
  const [loading, setLoading] = useState(true);

  const iframeSrc = useMemo(() => {
    const base = server === "vidWish" ? "vidwish.live" : "megaplay.buzz";
    const epId = episodeId?.split("ep=").pop() || "";
    return `https://${base}/stream/s-2/${epId}/${category}`;
  }, [server, episodeId, category]);

  const handleIframeLoad = () => setLoading(false);
  useEffect(() => setLoading(true), [server, category, episodeId]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-white rounded-xl overflow-hidden bg-[#0e0e10] border border-[#2a2a2f] shadow-[0_0_15px_rgba(255,0,128,0.15)]">
      {/* --- Player Frame --- */}
      <div className="relative w-full aspect-video bg-black rounded-t-xl overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
            <img src={loaderGif} alt="Loading..." className="w-16 h-16 mb-2 opacity-90" />
            <p className="text-gray-300 text-sm font-medium">Loading episode...</p>
          </div>
        )}

        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onLoad={handleIframeLoad}
        ></iframe>
      </div>

      {/* --- Controls & Info --- */}
      <div className="w-full bg-[#151518] p-4 flex flex-col gap-4 border-t border-[#2a2a2f]">
        {/* Episode Info Box */}
        <div className="bg-[#1c1c21] rounded-md p-3 text-center text-sm shadow-inner border border-[#2c2c31]">
          <p className="text-gray-300">
            You are watching{" "}
            <span className="text-pink-500 font-semibold">
              Episode {currentEp?.episodeNumber}
            </span>
          </p>
          {currentEp?.isFiller && (
            <p className="text-red-400 mt-1">This is a filler episode 👻</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            If the current server doesn’t work, try switching below.
          </p>
        </div>

        {/* Server & Language Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Servers */}
          <div className="flex gap-2">
            {["vidWish", "megaPlay"].map((srv) => (
              <button
                key={srv}
                onClick={() => setServer(srv)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  server === srv
                    ? "bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,128,0.6)]"
                    : "bg-[#2a2a31] hover:bg-[#3a3a42] text-gray-300"
                }`}
              >
                {srv === "vidWish" ? "HD-1" : "HD-2"}
              </button>
            ))}
          </div>

          {/* Category (Sub / Dub) */}
          <div className="flex gap-2">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  category === type
                    ? "bg-pink-500 text-white shadow-[0_0_10px_rgba(255,0,128,0.6)]"
                    : "bg-[#2a2a31] hover:bg-[#3a3a42] text-gray-300"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-1">
          {hasPrevEp && (
            <button
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-4 py-1.5 rounded-md text-sm font-semibold transition"
              onClick={() => changeEpisode("prev")}
            >
              <TbPlayerTrackPrevFilled size={18} /> Prev
            </button>
          )}
          {hasNextEp && (
            <button
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-4 py-1.5 rounded-md text-sm font-semibold transition"
              onClick={() => changeEpisode("next")}
            >
              Next <TbPlayerTrackNextFilled size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
