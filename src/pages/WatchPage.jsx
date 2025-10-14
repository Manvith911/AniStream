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

  // fetch episodes
  const { data, isError } = useApi(`/episodes/${id}`);
  const { data: infoData } = useApi(`/info/${id}`);

  const episodes = data?.data;
  const animeInfo = infoData?.data;

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

  if (isError) return <PageNotFound />;
  if (!episodes) return <Loader className="h-screen" />;

  const currentEp =
    episodes && ep !== null && episodes.find((e) => e.id.split("ep=").pop() === ep);

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
    <div className="bg-backGround pt-16 max-w-screen-2xl mx-auto px-3 md:px-6 pb-6">
      <Helmet>
        <title>
          Watch {id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Link to="/home" className="hover:text-primary">Home</Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
          {id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* ✅ Main Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT: Episodes */}
        <div
          className="bg-[#1a1a1f] rounded-md p-3 overflow-y-auto lg:w-[22%] min-h-[60vh]"
          style={{ maxHeight: "70vh" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">List of Episodes</h3>
            <div className="flex bg-[#2a2a2f] rounded-md">
              <button
                className={`p-2 ${layout === "row" ? "bg-primary text-black" : "text-white"}`}
                onClick={() => setLayout("row")}
              >
                <MdTableRows size={18} />
              </button>
              <button
                className={`p-2 ${layout === "column" ? "bg-primary text-black" : "text-white"}`}
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

        {/* MIDDLE: Player */}
        <div className="flex-1 bg-[#111] rounded-md overflow-hidden lg:w-[58%] min-h-[60vh]">
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

        {/* RIGHT: Anime Info */}
        <div className="bg-[#1a1a1f] rounded-md p-3 lg:w-[20%] min-h-[60vh] flex flex-col">
          {animeInfo ? (
            <>
              <img
                src={animeInfo.image}
                alt={animeInfo.title}
                className="rounded-md w-full h-auto object-cover mb-3"
              />
              <h2 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {animeInfo.title}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {animeInfo.type && (
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                    {animeInfo.type}
                  </span>
                )}
                {animeInfo.rating && (
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                    {animeInfo.rating}
                  </span>
                )}
                {animeInfo.duration && (
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                    {animeInfo.duration}
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed overflow-y-auto max-h-[30vh] pr-1">
                {animeInfo.description?.replace(/<[^>]+>/g, "") ||
                  "No description available."}
              </p>
            </>
          ) : (
            <div className="flex justify-center items-center flex-1 text-gray-400 text-sm">
              Loading anime info...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
