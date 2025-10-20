/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("megaPlay"); // Default server = megaplay
  const [loading, setLoading] = useState(true);

  const iframeSrc = useMemo(() => {
    const base = server === "vidWish" ? "vidwish.live" : "megaplay.buzz";
    const epId = episodeId?.split("ep=").pop() || "";
    return `https://${base}/stream/s-2/${epId}/${category}`;
  }, [server, episodeId, category]);

  const handleIframeLoad = () => setLoading(false);
  useEffect(() => setLoading(true), [server, category, episodeId]);

  return (
    <div className="w-full flex flex-col items-center rounded-md overflow-hidden bg-gradient-to-b from-[#141414] to-[#1a1a1f] border border-[#2c2c33] shadow-lg">
      {/* --- Video Player --- */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
            <img
              src="/assets/loader.gif"
              alt="Loading..."
              className="w-16 h-16 mb-3 select-none"
            />
            <p className="text-gray-300 text-sm font-medium">
              Loading episode...
            </p>
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

      {/* --- Controls Section --- */}
      <div className="w-full bg-[#1b1b22] px-4 py-5 border-t border-[#2e2e38] flex flex-col gap-4 text-white text-sm">
        {/* Info Box */}
        <div className="bg-[#24242d] rounded-md px-4 py-3 text-center">
          <p className="text-gray-300">
            You are watching{" "}
            <span className="text-pink-500 font-semibold">
              Episode {currentEp?.episodeNumber}
            </span>
          </p>
          {currentEp?.isFiller && (
            <p className="text-red-400 mt-1 text-sm">
              This is a filler episode 👻
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            If current server doesn’t work, please try another below.
          </p>
        </div>

        {/* Sub / Dub and Server Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Servers */}
          <div className="flex gap-2">
            {["vidWish", "megaPlay"].map((srv) => (
              <button
                key={srv}
                onClick={() => setServer(srv)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 border ${
                  server === srv
                    ? "bg-pink-500 text-white border-pink-500 shadow-md"
                    : "bg-[#2a2a32] border-[#33333a] hover:bg-[#3a3a43] text-gray-300"
                }`}
              >
                {srv === "vidWish" ? "HD-1" : "HD-2"}
              </button>
            ))}
          </div>

          {/* Sub / Dub */}
          <div className="flex gap-2">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 border ${
                  category === type
                    ? "bg-pink-500 text-white border-pink-500 shadow-md"
                    : "bg-[#2a2a32] border-[#33333a] hover:bg-[#3a3a43] text-gray-300"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Next / Prev */}
        <div className="flex justify-center gap-4 pt-2">
          {hasPrevEp && (
            <button
              onClick={() => changeEpisode("prev")}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-3 py-1.5 rounded-md font-semibold transition-all duration-200 shadow-md"
            >
              <TbPlayerTrackPrevFilled size={18} /> Prev
            </button>
          )}
          {hasNextEp && (
            <button
              onClick={() => changeEpisode("next")}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-3 py-1.5 rounded-md font-semibold transition-all duration-200 shadow-md"
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
