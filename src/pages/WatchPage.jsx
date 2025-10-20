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
  const ep = searchParams.get("ep");

  // Fetch anime details and episodes
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

  useEffect(() => {
    if (!ep && Array.isArray(episodes) && episodes.length > 0) {
      const firstEp = episodes[0].id.split("ep=").pop();
      updateParams(firstEp);
    }
  }, [ep, episodes, setSearchParams]);

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
    <div className="bg-[#0f0f11] text-white pt-16 pb-10 max-w-screen-2xl mx-auto px-3 md:px-6">
      <Helmet>
        <title>
          Watch {anime?.title?.romaji || anime?.title?.english} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 mb-4 text-sm text-gray-400">
        <Link to="/home" className="hover:text-primary">Home</Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
          {anime?.title?.romaji || anime?.title?.english}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="text-gray-300">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Episodes */}
        <div className="bg-[#17171a] rounded-xl p-4 overflow-y-auto lg:w-[25%] max-h-[70vh] border border-[#222]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">Episodes</h3>
            <div className="flex bg-[#222] rounded-md">
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

        {/* Player + Anime Info */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Player */}
          <div className="bg-[#111] rounded-xl overflow-hidden shadow-lg">
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

          {/* Anime Details Section */}
          <div className="flex flex-col sm:flex-row gap-5 bg-[#16161a] rounded-xl p-5 border border-[#222] shadow">
            {/* Poster */}
            <div className="flex-shrink-0 w-full sm:w-40 rounded-lg overflow-hidden">
              <img
                src={anime?.image}
                alt={anime?.title?.romaji}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-2">
                  {anime?.title?.romaji || anime?.title?.english}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                  {anime?.rating && (
                    <span className="bg-[#222] px-2 py-1 rounded-md">
                      ⭐ {anime.rating / 10}
                    </span>
                  )}
                  {anime?.type && (
                    <span className="bg-[#222] px-2 py-1 rounded-md uppercase">
                      {anime.type}
                    </span>
                  )}
                  {anime?.status && (
                    <span className="bg-[#222] px-2 py-1 rounded-md capitalize">
                      {anime.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {anime?.description?.replace(/<[^>]+>/g, "") || "No description available."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {anime?.genres?.slice(0, 5).map((g) => (
                  <span
                    key={g}
                    className="bg-[#222] text-gray-300 text-xs px-2 py-1 rounded-md"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Comments Placeholder */}
          <div className="bg-[#16161a] rounded-xl p-5 border border-[#222] text-gray-400 text-sm italic">
            Comments section coming soon 💬
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
