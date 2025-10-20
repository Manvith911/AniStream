/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import { Loader2 } from "lucide-react"; // spinner icon

const Player = ({
  episodeId,
  currentEp,
  changeEpisode,
  hasNextEp,
  hasPrevEp,
}) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("megaPlay"); // default changed
  const [loading, setLoading] = useState(true);

  const iframeSrc = useMemo(() => {
    const base = server === "vidWish" ? "vidwish.live" : "megaplay.buzz";
    const epId = episodeId?.split("ep=").pop() || "";
    return `https://${base}/stream/s-2/${epId}/${category}`;
  }, [server, episodeId, category]);

  const handleIframeLoad = () => setLoading(false);

  useEffect(() => {
    // show loading when changing category or server
    setLoading(true);
  }, [server, category, episodeId]);

  return (
    <div className="w-full flex flex-col items-center bg-darkbg text-white rounded-lg overflow-hidden shadow-lg">
      {/* Player Frame */}
      <div className="w-full relative aspect-video bg-black max-w-screen-xl">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
            <p className="mt-2 text-sm text-gray-300">Loading video...</p>
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

      {/* Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-3 md:px-10 py-3 bg-lightbg border-t border-gray-700">
        {/* Server Selection */}
        <div className="flex gap-3">
          {["vidWish", "megaPlay"].map((srv) => (
            <button
              key={srv}
              onClick={() => setServer(srv)}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
                server === srv
                  ? "bg-primary text-black shadow-md"
                  : "bg-btnbg text-gray-200 hover:bg-gray-700"
              }`}
            >
              {srv.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Sub/Dub & Navigation */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="flex gap-2">
            {["sub", "dub"].map((type) => (
              <button
                key={type}
                onClick={() => setCategory(type)}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
                  category === type
                    ? "bg-primary text-black shadow-md"
                    : "bg-btnbg text-gray-200 hover:bg-gray-700"
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
                className="bg-primary hover:bg-primary/80 text-black rounded-md p-2 transition"
                onClick={() => changeEpisode("prev")}
              >
                <TbPlayerTrackPrevFilled size={20} />
              </button>
            )}
            {hasNextEp && (
              <button
                title="Next Episode"
                className="bg-primary hover:bg-primary/80 text-black rounded-md p-2 transition"
                onClick={() => changeEpisode("next")}
              >
                <TbPlayerTrackNextFilled size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Episode Info */}
        <div className="text-center sm:text-right text-sm mt-2 sm:mt-0">
          <p className="text-gray-400">
            You are watching Episode {currentEp?.episodeNumber}
          </p>
          {currentEp?.isFiller && (
            <p className="text-red-400 font-medium">
              This is a filler episode 👻
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
