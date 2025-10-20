import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { Helmet } from "react-helmet";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";
import Recommended from "../layouts/Recommended";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");
  const ep = searchParams.get("ep");

  // Fetch episodes
  const { data: epData, isError: epError, isLoading: epLoading } = useApi(`/episodes/${id}`);
  const episodes = epData?.data;

  // Fetch anime details
  const { data: detailsData, isError: detailsError, isLoading: detailsLoading } = useApi(`/anime/${id}`);
  const details = detailsData?.data;

  const updateParams = (newParam) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("ep", newParam);
      return newParams;
    });
  };

  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEp = episodes[0].id.split("ep=").pop();
      updateParams(firstEp);
    }
  }, [ep, episodes]);

  if (epError || detailsError) return <PageNotFound />;
  if (epLoading || detailsLoading || !episodes || !details) {
    return <Loader className="h-screen" />;
  }

  const currentEp = episodes.find((e) => e.id.split("ep=").pop() === ep);
  if (!currentEp) return <Loader className="h-screen" />;

  const changeEpisode = (action) => {
    const index = currentEp.episodeNumber - 1;
    if (action === "next" && episodes[index + 1]) {
      updateParams(episodes[index + 1].id.split("ep=").pop());
    } else if (action === "prev" && episodes[index - 1]) {
      updateParams(episodes[index - 1].id.split("ep=").pop());
    }
  };

  const hasNextEp = Boolean(episodes[currentEp.episodeNumber]);
  const hasPrevEp = Boolean(episodes[currentEp.episodeNumber - 2]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e10] p-4 text-white">
      <Helmet>
        <title>{`${details?.title} - Episode ${currentEp?.episodeNumber}`}</title>
      </Helmet>

      <main className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left: Episode List */}
        <div className="lg:w-[25%] bg-[#1a1a1f] rounded-xl p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">Episodes</h3>
            <div className="flex bg-[#2a2a2f] rounded-md">
              <button
                className={`p-2 transition ${
                  layout === "row" ? "bg-primary text-black" : "text-white"
                }`}
                onClick={() => setLayout("row")}
              >
                <MdTableRows size={18} />
              </button>
              <button
                className={`p-2 transition ${
                  layout === "column" ? "bg-primary text-black" : "text-white"
                }`}
                onClick={() => setLayout("column")}
              >
                <HiMiniViewColumns size={18} />
              </button>
            </div>
          </div>

          <ul
            className={`grid gap-1 ${
              layout === "row"
                ? "grid-cols-1"
                : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {episodes.map((episode) => (
              <Episodes
                key={episode.id}
                episode={episode}
                currentEp={currentEp}
                layout={layout}
              />
            ))}
          </ul>
        </div>

        {/* Middle: Video Player */}
        <div className="flex-1 bg-[#111] rounded-xl overflow-hidden shadow-lg">
          {ep && id && (
            <Player
              id={id}
              episodeId={`${id}?ep=${ep}`}
              currentEp={currentEp}
              changeEpisode={changeEpisode}
              hasNextEp={hasNextEp}
              hasPrevEp={hasPrevEp}
            />
          )}
        </div>

        {/* Right: Anime Details */}
        <div className="lg:w-[25%] bg-[#1a1a1f] rounded-xl p-4 text-gray-300 space-y-4">
          <img
            src={details?.poster}
            alt={details?.title}
            className="w-full rounded-lg object-cover shadow-md"
          />
          <div>
            <h1 className="text-xl font-bold text-white mb-1">
              {details?.title}
            </h1>
            {details?.alternativeTitle && (
              <h2 className="text-sm text-gray-400 italic mb-2">
                {details.alternativeTitle}
              </h2>
            )}
            <p className="text-sm text-gray-400 line-clamp-6">
              {details?.synopsis}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div>
              <span className="text-gray-500">Type:</span> {details?.type}
            </div>
            <div>
              <span className="text-gray-500">Status:</span> {details?.status}
            </div>
            <div>
              <span className="text-gray-500">Premiered:</span> {details?.premiered}
            </div>
            <div>
              <span className="text-gray-500">Duration:</span> {details?.duration}
            </div>
            <div>
              <span className="text-gray-500">Genres:</span>{" "}
              {details?.genres?.join(", ")}
            </div>
            <div>
              <span className="text-gray-500">Rating:</span> {details?.rating}
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Section */}
      <Recommended recommendedList={details.recommended} />
    </div>
  );
};

export default WatchPage;
