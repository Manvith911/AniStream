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
  }, [ep, episodes]);

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
    <div className="bg-[#0f0f14] pt-16 max-w-screen-2xl mx-auto px-3 md:px-6 pb-6 text-gray-200">
      <Helmet>
        <title>Watch {id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm</title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Link to="/home" className="hover:text-pink-400">Home</Link>
        <span className="text-pink-400">•</span>
        <Link to={`/anime/${id}`} className="hover:text-pink-400 capitalize">
          {id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="text-pink-400">•</span>
        <h4>Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr_25%] gap-6">
        {/* Episode List */}
        <div className="bg-[#1a1a1f] p-4 rounded-xl max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold text-sm">List of Episodes:</h3>
            <div className="flex gap-1 bg-[#2a2a2f] rounded-md">
              <button
                className={`p-2 ${layout === "row" ? "bg-pink-400 text-black" : "text-white"}`}
                onClick={() => setLayout("row")}
              >
                <MdTableRows size={18} />
              </button>
              <button
                className={`p-2 ${layout === "column" ? "bg-pink-400 text-black" : "text-white"}`}
                onClick={() => setLayout("column")}
              >
                <HiMiniViewColumns size={18} />
              </button>
            </div>
          </div>

          <ul className={`grid gap-2 ${layout === "row" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
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

        {/* Player */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg">
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

        {/* Anime Info Panel */}
        {info ? (
          <div className="bg-[#1a1a1f] p-4 rounded-xl space-y-4">
            <img src={info.poster} alt={info.title} className="rounded-lg w-full object-cover" />

            <div>
              <h2 className="text-lg font-bold text-white mb-1">{info.title}</h2>
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">{info.type}</span>
                <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">{info.rating}</span>
                <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">{info.duration}</span>
                <span className="bg-[#2a2a2f] px-2 py-1 rounded-md">{info.status}</span>
              </div>
            </div>

            {info.genres && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {info.genres.map((g) => (
                    <span key={g} className="bg-[#2a2a2f] px-2 py-1 text-xs rounded-md">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {info.studios && (
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">Studio:</span> {info.studios}
              </p>
            )}

            {info.synopsis && (
              <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                {info.synopsis.length > 500 ? info.synopsis.slice(0, 500) + "..." : info.synopsis}
              </p>
            )}
          </div>
        ) : (
          <Loader className="h-64" />
        )}
      </div>
    </div>
  );
};

export default WatchPage;
