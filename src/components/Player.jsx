/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { Loader2 } from "lucide-react";

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("megaPlay"); // Default to megaplay
  const [loading, setLoading] = useState(true);

  const iframeSrc = useMemo(() => {
    const base = server === "vidWish" ? "vidwish.live" : "megaplay.buzz";
    const epId = episodeId?.split("ep=").pop() || "";
    return `https://${base}/stream/s-2/${epId}/${category}`;
  }, [server, episodeId, category]);

  const handleIframeLoad = () => setLoading(false);
  useEffect(() => setLoading(true), [server, category, episodeId]);

  return (
    <div className="w-full flex flex-col items-center text-white rounded-md overflow-hidden bg-[#16161a] border border-gray-800 shadow-xl">
      {/* --- Video Player --- */}
      <div className="relative w-full aspect-video bg-black rounded-t-md overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
            <Loader2 className="animate-spin w-8 h-8 text-pink-400" />
            <p className="mt-2 text-gray-300 text-sm">Loading episode...</p>
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

      {/* --- Info & Controls --- */}
      <div className="w-full bg-[#1f1f25] p-4 flex flex-col gap-3 border-t border-gray-700">
        {/* Episode Info Box */}
        <div className="bg-[#2a2a31] rounded-md p-3 text-center text-sm">
          <p className="text-gray-300">
            You are watching <span className="text-pink-400 font-semibold">Episode {currentEp?.episodeNumber}</span>
          </p>
          {currentEp?.isFiller && (
            <p className="text-red-400 mt-1">This is a filler episode 👻</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            If current server doesn’t work, try another below.
          </p>
        </div>

        {/* Server + Category */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2">
            {["vidWish", "megaPlay"].map((srv) => (
              <button
                key={srv}
                onClick={() => setServer(srv)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  server === srv
                    ? "bg-pink-500 text-white"
                    : "bg-[#2a2a31] hover:bg-[#3a3a42] text-gray-300"
                }`}
              >
                {srv === "vidWish" ? "HD-1" : "HD-2"}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  category === type
                    ? "bg-pink-500 text-white"
                    : "bg-[#2a2a31] hover:bg-[#3a3a42] text-gray-300"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Next / Prev Buttons */}
        <div className="flex justify-center gap-4 mt-2">
          {hasPrevEp && (
            <button
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-3 py-1 rounded-md text-sm font-semibold transition"
              onClick={() => changeEpisode("prev")}
            >
              <TbPlayerTrackPrevFilled size={18} /> Prev
            </button>
          )}
          {hasNextEp && (
            <button
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-black px-3 py-1 rounded-md text-sm font-semibold transition"
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
