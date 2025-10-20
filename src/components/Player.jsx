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
  const [server, setServer] = useState("megaPlay");
  const [loading, setLoading] = useState(true);

  const iframeSrc = useMemo(() => {
    const base = server === "vidWish" ? "vidwish.live" : "megaplay.buzz";
    const epId = episodeId?.split("ep=").pop() || "";
    return `https://${base}/stream/s-2/${epId}/${category}`;
  }, [server, episodeId, category]);

  useEffect(() => setLoading(true), [server, category, episodeId]);
  const handleIframeLoad = () => setLoading(false);

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#0b0b0d] rounded-lg overflow-hidden border border-[#1f1f23] shadow-md">
      {/* --- Video Frame --- */}
      <div className="relative aspect-video bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
            <img src={loaderGif} alt="Loading..." className="w-12 h-12 mb-2 opacity-90" />
            <p className="text-gray-300 text-sm">Loading...</p>
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

      {/* --- Controls --- */}
      <div className="bg-[#141416] border-t border-[#1f1f23] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-gray-300">
        {/* Left side: Server and Category */}
        <div className="flex flex-wrap gap-2">
          {["vidWish", "megaPlay"].map((srv) => (
            <button
              key={srv}
              onClick={() => setServer(srv)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                server === srv
                  ? "bg-[#2563eb] text-white"
                  : "bg-[#1f1f23] hover:bg-[#2a2a2e] text-gray-300"
              }`}
            >
              {srv === "vidWish" ? "HD-1" : "HD-2"}
            </button>
          ))}
          {["sub", "dub"].map((type) => (
            <button
              key={type}
              onClick={() => setCategory(type)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                category === type
                  ? "bg-[#2563eb] text-white"
                  : "bg-[#1f1f23] hover:bg-[#2a2a2e] text-gray-300"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Right side: Episode Nav */}
        <div className="flex gap-2 justify-center sm:justify-end">
          {hasPrevEp && (
            <button
              onClick={() => changeEpisode("prev")}
              className="flex items-center gap-1 bg-[#2563eb] hover:bg-[#3b82f6] text-white px-3 py-1.5 rounded-md text-sm font-medium"
            >
              <TbPlayerTrackPrevFilled size={16} /> Prev
            </button>
          )}
          {hasNextEp && (
            <button
              onClick={() => changeEpisode("next")}
              className="flex items-center gap-1 bg-[#2563eb] hover:bg-[#3b82f6] text-white px-3 py-1.5 rounded-md text-sm font-medium"
            >
              Next <TbPlayerTrackNextFilled size={16} />
            </button>
          )}
        </div>
      </div>

      {/* --- Bottom Info (small, subtle like HiAnime) --- */}
      <div className="bg-[#0f0f12] text-center text-xs text-gray-500 py-2 border-t border-[#1f1f23]">
        Episode {currentEp?.episodeNumber}
        {currentEp?.isFiller && <span className="text-red-400"> • Filler Episode 👻</span>}
      </div>
    </div>
  );
};

export default Player;
