/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Loader from "../components/Loader";
import Player from "../components/Player";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [schedule, setSchedule] = useState(null);
  const [layout, setLayout] = useState("row");

  const ep = searchParams.get("ep");

  // Fetch episodes info
  const { data, isError } = useApi(`/episodes/${id}`);
  const episodes = data?.eps || data?.data || [];

  // Auto select first episode
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEp = episodes[0].id.split("ep=").pop();
      setSearchParams({ ep: firstEp });
    }
  }, [ep, episodes, setSearchParams]);

  // Fetch next episode schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/schedule/next/${id}`);
        const json = await res.json();
        setSchedule(json);
      } catch (err) {
        console.error("Schedule fetch failed:", err);
      }
    };
    fetchSchedule();
  }, [id]);

  if (isError) return <PageNotFound />;
  if (!episodes || episodes.length === 0) return <Loader className="h-screen" />;

  const currentEp = episodes.find((e) => e.id.split("ep=").pop() === ep);
  if (!currentEp) return <Loader className="h-screen" />;

  const index = currentEp.episodeNumber - 1;
  const hasNextEp = Boolean(episodes[index + 1]);
  const hasPrevEp = Boolean(episodes[index - 1]);

  const changeEpisode = (action) => {
    if (action === "next" && hasNextEp)
      setSearchParams({ ep: episodes[index + 1].id.split("ep=").pop() });
    else if (action === "prev" && hasPrevEp)
      setSearchParams({ ep: episodes[index - 1].id.split("ep=").pop() });
  };

  // === Layout ===
  return (
    <div className="bg-[#0b0b0e] min-h-screen pt-16 pb-10 text-white">
      <Helmet>
        <title>Watch {id.split("-").slice(0, 2).join(" ")} - AnimeRealm</title>
      </Helmet>

      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6 px-4">
        {/* Left Sidebar - Episode list */}
        <div className="bg-[#18181d] rounded-lg p-3 w-full lg:w-[22%] max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
            List of Episodes
          </h2>
          <ul className="flex flex-col divide-y divide-gray-800">
            {Array.isArray(episodes) &&
              episodes.map((episode) => (
                <li
                  key={episode.id}
                  onClick={() =>
                    setSearchParams({
                      ep: episode.id.split("ep=").pop(),
                    })
                  }
                  className={`p-2 cursor-pointer rounded-md transition ${
                    currentEp.id === episode.id
                      ? "bg-primary text-black font-semibold"
                      : "hover:bg-[#202025]"
                  }`}
                >
                  Episode {episode.episodeNumber}
                </li>
              ))}
          </ul>
        </div>

        {/* Middle - Player */}
        <div className="flex-1 flex flex-col gap-4">
          <Player
            id={id}
            episodeId={`${id}?ep=${ep}`}
            currentEp={currentEp}
            changeEpisode={changeEpisode}
            hasNextEp={hasNextEp}
            hasPrevEp={hasPrevEp}
          />

          {/* Player Bottom Info */}
          <div className="bg-[#1c1c21] p-4 rounded-lg text-sm text-gray-300">
            <p>
              You are watching{" "}
              <span className="text-primary font-semibold">
                Episode {currentEp.episodeNumber}
              </span>
              . If the current server doesn’t work, try switching servers below.
            </p>
            {schedule && schedule.time && (
              <div className="mt-2 bg-[#121214] text-center p-2 rounded-md text-blue-300">
                Estimated next episode:{" "}
                <span className="text-white font-semibold">
                  {new Date(schedule.time).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right - Anime Info */}
        <div className="bg-[#18181d] rounded-lg p-4 w-full lg:w-[25%] flex flex-col gap-3">
          <div className="flex gap-3">
            <img
              src={data?.anime?.image || currentEp?.image || "/fallback.jpg"}
              alt={id}
              className="rounded-md w-[100px] h-[140px] object-cover"
            />
            <div>
              <h3 className="text-lg font-bold">
                {data?.anime?.title?.english || id.split("-").slice(0, 2).join(" ")}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="bg-gray-700 px-2 py-1 rounded">PG-13</span>
                <span className="bg-gray-700 px-2 py-1 rounded">
                  {data?.anime?.type || "TV"}
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded">
                  {data?.anime?.duration || "24m"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            {data?.anime?.description?.slice(0, 280) || "Description not available."}
            {data?.anime?.description?.length > 280 && "..."}
          </p>

          {data?.anime?.rating && (
            <div className="bg-[#101012] p-3 rounded-lg mt-2 text-center">
              ⭐ <span className="text-yellow-400">{data.anime.rating}</span> / 10
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
