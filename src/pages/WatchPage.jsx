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

  // Fetch episodes
  const { data: episodesRes, isError: episodesError } = useApi(`/episodes/${id}`);
  const episodes = episodesRes?.data;

  // Fetch anime info (for SEO title only)
  const { data: infoRes, isError: infoError } = useApi(`/info/${id}`);
  const animeInfo = infoRes?.data;

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

  if (episodesError || infoError) return <PageNotFound />;
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
          Watch {animeInfo?.title || id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Link to="/home" className="hover:text-primary">Home</Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
          {animeInfo?.title || id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Player Section */}
        <div className="w-full lg:w-[70%] bg-[#111] rounded-xl overflow-hidden shadow-lg">
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

        {/* Episode List Section */}
        <div
          className="w-full lg:w-[30%] bg-[#1a1a1f] rounded-xl p-3 overflow-y-auto"
          style={{ maxHeight: "75vh" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">Episodes</h3>
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
            className={`grid gap-2 ${
              layout === "row"
                ? "grid-cols-1"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-2"
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
      </div>
    </div>
  );
};

export default WatchPage;
