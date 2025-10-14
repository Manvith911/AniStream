import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { MdTableRows } from "react-icons/md";
import { HiMiniViewColumns } from "react-icons/hi2";
import { Helmet } from "react-helmet";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");

  const ep = searchParams.get("ep");

  const { data, isError } = useApi(`/episodes/${id}`);
  const episodes = data?.data;

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
    episodes &&
    ep !== null &&
    episodes.find((e) => e.id.split("ep=").pop() === ep);

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
    <div className="bg-backGround pt-14 max-w-screen-xl mx-auto py-2 md:px-2">
      <Helmet>
        <title>
          Watch {id.split("-").slice(0, 2).join(" ")} Online, Free Anime
          Streaming Online on AnimeRealm
        </title>
        <meta property="og:title" content="watch - AnimeRealm" />
      </Helmet>

      <div className="path flex mb-2 mx-2 items-center gap-2 text-base">
        <Link to="/home" className="hover:text-primary">home</Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary">
          {id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">{`episode ${currentEp.episodeNumber}`}</h4>
      </div>

      {/* 🧩 Main Flex Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT: Episode List */}
        <div className="md:w-1/3 lg:w-1/4 bg-lightbg rounded-md p-2 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm font-semibold">Episodes</h3>
            <div className="btns bg-btnbg flex rounded-child">
              <button
                className={`p-2 ${layout === "row" ? "bg-primary text-black" : ""}`}
                onClick={() => setLayout("row")}
              >
                <MdTableRows size={18} />
              </button>
              <button
                className={`p-2 ${layout === "column" ? "bg-primary text-black" : ""}`}
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
                : "grid-cols-3 sm:grid-cols-4 md:grid-cols-2"
            }`}
          >
            {episodes?.map((episode) => (
              <Episodes
                key={episode.id}
                episode={episode}
                currentEp={currentEp}
                layout={layout}
              />
            ))}
          </ul>
        </div>

        {/* RIGHT: Player */}
        <div className="flex-1">
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
      </div>
    </div>
  );
};

export default WatchPage;
