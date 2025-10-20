import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");
  const [nextEp, setNextEp] = useState(null);
  const ep = searchParams.get("ep");

  // fetch anime details and episodes
  const { data: animeData, isError: animeError } = useApi(`/anime/${id}`);
  const { data: episodesData, isError: episodesError } = useApi(`/episodes/${id}`);

  const anime = animeData?.data;
  const episodes = episodesData?.data;

  const updateParams = (newParam) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("ep", newParam);
      return newParams;
    });
  };

  // auto-select first episode
  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEp = episodes[0].id.split("ep=").pop();
      updateParams(firstEp);
    }
  }, [ep, episodes, setSearchParams]);

  // fetch next-episode schedule
  useEffect(() => {
    const fetchNext = async () => {
      try {
        const res = await fetch(`/schadule/next/${id}`);
        const json = await res.json();
        setNextEp(json?.data);
      } catch {
        setNextEp(null);
      }
    };
    fetchNext();
  }, [id]);

  if (animeError || episodesError) return <PageNotFound />;
  if (!anime || !episodes) return <Loader className="h-screen" />;

  const currentEp =
    episodes && ep
      ? episodes.find((e) => e.id.split("ep=").pop() === ep)
      : null;

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
    <div className="min-h-screen bg-[#0f0f11] text-white pt-16 pb-0">
      <Helmet>
        <title>
          Watch {anime?.title?.romaji || anime?.title?.english} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="max-w-screen-2xl mx-auto px-4 text-sm text-gray-300 mb-4">
        <div className="flex items-center flex-wrap gap-2">
          <Link to="/home" className="hover:text-primary">Home</Link>
          <span className="h-1 w-1 rounded-full bg-primary"></span>
          <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
            {anime?.title?.romaji || anime?.title?.english}
          </Link>
          <span className="h-1 w-1 rounded-full bg-primary"></span>
          <h4 className="text-gray-300">Episode {currentEp?.episodeNumber}</h4>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto gap-5 px-3 md:px-6 pb-4">
        {/* Left Sidebar - Episode list */}
        <div className="bg-[#1a1a1f] rounded-xl p-4 overflow-y-auto lg:w-[20%] max-h-[75vh] border border-[#222]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">List of Episodes:</h3>
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
              layout === "row" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
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

        {/* Center Player */}
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

        {/* Right Info Section */}
        <div className="bg-[#17171a] rounded-xl p-4 border border-[#222] lg:w-[25%] flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <img
              src={anime?.image}
              alt={anime?.title?.romaji}
              className="w-28 h-40 object-cover rounded-md"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold leading-tight mb-1">
                {anime?.title?.romaji || anime?.title?.english}
              </h1>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="bg-[#2a2a2f] px-2 py-0.5 rounded-md">PG-13</span>
                {anime?.rating && (
                  <span className="bg-[#2a2a2f] px-2 py-0.5 rounded-md">
                    {Math.round(anime.rating / 10)}/10
                  </span>
                )}
                {anime?.type && (
                  <span className="bg-[#2a2a2f] px-2 py-0.5 rounded-md uppercase">
                    {anime.type}
                  </span>
                )}
                {anime?.episodes && (
                  <span className="bg-[#2a2a2f] px-2 py-0.5 rounded-md">
                    {anime.episodes} eps
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
            {anime?.description?.replace(/<[^>]+>/g, "")}
          </p>

          <div className="flex flex-wrap gap-2">
            {anime?.genres?.slice(0, 5).map((g) => (
              <span
                key={g}
                className="bg-[#2a2a2f] text-gray-300 text-xs px-2 py-1 rounded-md"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="bg-[#202024] rounded-lg p-3 text-center text-gray-300 text-sm">
            ⭐ {anime?.rating ? Math.round(anime.rating / 10) : "N/A"} ·{" "}
            {anime?.status} · {anime?.type}
          </div>
        </div>
      </div>

      {/* Bottom Info Bars */}
      <div className="w-full bg-[#ff6b8b] text-black text-center py-2 text-sm font-semibold">
        You are watching Episode {currentEp?.episodeNumber} — If the server
        doesn’t work, try another one beside.
      </div>
      {nextEp && (
        <div className="w-full bg-[#007bff] text-white text-center py-2 text-sm">
          Estimated the next episode will come at{" "}
          <span className="font-semibold">{new Date(nextEp.airTime).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default WatchPage;
