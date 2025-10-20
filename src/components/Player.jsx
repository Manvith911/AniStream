/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";

// Custom hook to fetch the next episode time
function useNextEpisodeTime(animeSlug) {
  const [nextTime, setNextTime] = useState(null);

  useEffect(() => {
    fetch(`https://animerealm.vercel.app/api/schadule/next/${animeSlug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.time) {
          setNextTime(json.data.time);
        }
      })
      .catch(err => console.error("Failed to fetch next episode time", err));
  }, [animeSlug]);

  return nextTime;
}

const Player = ({ episodeId, currentEp, changeEpisode, hasNextEp, hasPrevEp, animeSlug }) => {
  const [category, setCategory] = useState("sub");
  const [server, setServer] = useState("HD-1");

  const nextEpisodeTime = useNextEpisodeTime(animeSlug);

  const formattedNextTime = nextEpisodeTime
    ? new Date(nextEpisodeTime).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
    : null;

  // Server domain mapping
  const serverHosts = {
    "HD-1": "megaplay.buzz",
    "HD-2": "megaplay2.buzz",
    "HD-3": "vidwish.live",
  };

  const streamHost = serverHosts[server] || "megaplay.buzz";
  const epNumber = episodeId.split("ep=").pop();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-white font-sans">
      {/* Video Frame */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://${streamHost}/stream/s-2/${epNumber}/${category}`}
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Player Controls */}
      <div className="w-full bg-[#1f1f1f] px-4 py-4 rounded-b-xl border-t border-[#292929] mt-2 space-y-4">
        {/* Top Info and Navigation */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Episode Info */}
          <div className="bg-pink-300 text-black px-4 py-2 rounded font-semibold text-sm">
            You are watching Episode {currentEp.episodeNumber}
            <br />
            <span className="text-xs">
              If current server doesn't work please try other servers beside.
            </span>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2 text-sm">
            {hasPrevEp && (
              <button
                onClick={() => changeEpisode("prev")}
                className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-md transition"
              >
                <TbPlayerTrackPrevFilled size={18} /> Prev
              </button>
            )}
            {hasNextEp && (
              <button
                onClick={() => changeEpisode("next")}
                className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 rounded-md transition"
              >
                Next <TbPlayerTrackNextFilled size={18} />
              </button>
            )}
          </div>

          {/* Extra Buttons */}
          <div className="flex items-center gap-4 text-sm">
            <button className="hover:underline">Add to List</button>
            <button className="text-pink-400 hover:underline">Watch2gether</button>
          </div>
        </div>

        {/* Server Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* SUB Servers */}
          <div className="text-center">
            <p className="mb-1 text-sm">SUB:</p>
            {["HD-1", "HD-2", "HD-3"].map((s) => (
              <button
                key={`sub-${s}`}
                onClick={() => {
                  setServer(s);
                  setCategory("sub");
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium mr-1 ${
                  server === s && category === "sub"
                    ? "bg-pink-500 text-black"
                    : "bg-[#2a2a2a] text-white hover:bg-[#343434]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* DUB Servers */}
          <div className="text-center">
            <p className="mb-1 text-sm">DUB:</p>
            {["HD-1", "HD-2", "HD-3"].map((s) => (
              <button
                key={`dub-${s}`}
                onClick={() => {
                  setServer(s);
                  setCategory("dub");
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium mr-1 ${
                  server === s && category === "dub"
                    ? "bg-pink-500 text-black"
                    : "bg-[#2a2a2a] text-white hover:bg-[#343434]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Estimate Bar */}
        {formattedNextTime && (
          <div className="w-full bg-[#2ab7ca] text-black text-sm text-center px-4 py-2 rounded-md font-medium">
            Estimated the next episode will come at {formattedNextTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
