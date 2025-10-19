import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { Helmet } from "react-helmet";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");
  const ep = searchParams.get("ep");

  const { data, isError } = useApi(`/episodes/${id}`);
  const { data: animeInfo } = useApi(`/anime/${id}`);

  const episodes = data?.data;
  const info = animeInfo?.data;

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

  if (isError) return <PageNotFound />;
  if (!episodes) return <Loader className="h-screen" />;

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
    <div className="bg-[#0e0e12] min-h-screen pt-16 text-gray-200">
      <Helmet>
        <title>
          Watch {id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      <div className="max-w-[1450px] mx-auto px-4 md:px-6 pb-10">
        {/* Breadcrumbs */}
        <div className="flex items-center flex-wrap gap-2 mb-5 text-sm text-gray-400">
          <Link to="/home" className="hover:text-pink-500">
            Home
          </Link>
          <span className="h-1 w-1 rounded-full bg-pink-500"></span>
          <Link
            to={`/anime/${id}`}
            className="hover:text-pink-500 capitalize"
          >
            {id.split("-").slice(0, 2).join(" ")}
          </Link>
          <span className="h-1 w-1 rounded-full bg-pink-500"></span>
          <h4 className="text-gray-300">Episode {currentEp?.episodeNumber}</h4>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_300px] gap-5">
          {/* Left - Episode list */}
          <div className="bg-[#1a1a1f] rounded-xl p-4 max-h-[80vh] overflow-y-auto shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-semibold">
                List of episodes
              </h3>
              <div className="flex bg-[#2a2a2f] rounded-md">
                <button
                  className={`p-2 transition ${
                    layout === "row"
                      ? "bg-pink-500 text-black"
                      : "text-gray-300"
                  }`}
                  onClick={() => setLayout("row")}
                >
                  <MdTableRows size={18} />
                </button>
                <button
                  className={`p-2 transition ${
                    layout === "column"
                      ? "bg-pink-500 text-black"
                      : "text-gray-300"
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

          {/* Center - Player */}
          <div className="bg-[#111] rounded-xl overflow-hidden shadow-lg flex flex-col">
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

            {/* Bottom Player Info Bar */}
            <div className="bg-[#141419] border-t border-[#2a2a2f] p-4 text-sm text-center space-y-2">
              <div className="text-pink-400">
                You are watching{" "}
                <span className="font-semibold text-white">
                  Episode {currentEp.episodeNumber}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-gray-300 text-xs">
                <span className="bg-[#2a2a2f] px-3 py-1 rounded-md">
                  SUB: <button className="ml-1 bg-pink-500 px-2 py-0.5 rounded">HD-1</button>{" "}
                  <button className="ml-1 bg-[#2a2a2f] px-2 py-0.5 rounded">HD-2</button>
                </span>
                <span className="bg-[#2a2a2f] px-3 py-1 rounded-md">
                  DUB: <button className="ml-1 bg-[#2a2a2f] px-2 py-0.5 rounded">HD-1</button>{" "}
                  <button className="ml-1 bg-[#2a2a2f] px-2 py-0.5 rounded">HD-2</button>
                </span>
              </div>
              <p className="text-xs text-blue-400">
                Estimated next episode will come at 10/25/2025, 8:00:00 PM
              </p>
            </div>
          </div>

          {/* Right - Anime Info */}
          {info ? (
            <div className="bg-[#1a1a1f] rounded-xl p-4 space-y-4 shadow-md">
              <img
                src={info.poster}
                alt={info.title}
                className="rounded-lg w-full object-cover shadow-md"
              />
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  {info.title}
                </h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                  <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">
                    {info.type}
                  </span>
                  <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">
                    {info.rating}
                  </span>
                  <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">
                    {info.duration}
                  </span>
                  <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">
                    {info.status}
                  </span>
                </div>
              </div>

              {info.genres && (
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.genres.map((g) => (
                      <span
                        key={g}
                        className="bg-[#2a2a2f] px-2 py-1 rounded-md text-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {info.studios && (
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-white">Studio:</span>{" "}
                  {info.studios}
                </p>
              )}

              {info.synopsis && (
                <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                  {info.synopsis.length > 400
                    ? info.synopsis.slice(0, 400) + "..."
                    : info.synopsis}
                </p>
              )}
            </div>
          ) : (
            <Loader className="h-64" />
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
