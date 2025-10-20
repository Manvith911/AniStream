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
  const [animeInfo, setAnimeInfo] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [countdown, setCountdown] = useState(null);

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

  // Fetch anime details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/anime/${id}`);
        const json = await res.json();
        setAnimeInfo(json.data);
      } catch (err) {
        console.error("Failed to load anime details", err);
      }
    };
    fetchDetails();
  }, [id]);

  // Fetch schedule for next episode
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/schadule/next/${id}`);
        const json = await res.json();
        if (json.success) {
          setNextSchedule(json.data.time);
        }
      } catch (err) {
        console.error("Failed to load next schedule", err);
      }
    };
    fetchSchedule();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!nextSchedule) return;
    const interval = setInterval(() => {
      const now = new Date();
      const release = new Date(nextSchedule.replace(" ", "T"));
      const diff = release - now;
      if (diff <= 0) {
        setCountdown("Releasing soon!");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown(`${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextSchedule]);

  // Auto-select first episode if none is selected
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
    <div className="bg-backGround pt-16 max-w-screen-2xl mx-auto px-3 md:px-6 pb-6">
      <Helmet>
        <title>
          Watch {animeInfo?.title || id.split("-").slice(0, 2).join(" ")} Episode {currentEp?.episodeNumber} - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 mb-4 text-sm text-gray-300">
        <Link to="/home" className="hover:text-primary">Home</Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
          {animeInfo?.title || id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Anime Info Header */}
      {animeInfo && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <img
            src={animeInfo.image}
            alt={animeInfo.title}
            className="w-32 h-44 rounded-md object-cover shadow-md"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-semibold text-white">{animeInfo.title}</h1>
            <p className="text-gray-400 text-sm mt-1 line-clamp-3">{animeInfo.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {animeInfo.genres?.map((g) => (
                <span
                  key={g}
                  className="text-xs bg-primary text-black px-2 py-1 rounded-md"
                >
                  {g}
                </span>
              ))}
            </div>
            {nextSchedule && (
              <p className="text-primary text-sm mt-2">
                Next episode airs in: <strong>{countdown}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-5">
        {/* Episode List */}
        <div className="bg-[#1a1a1f] rounded-xl p-4 overflow-y-auto lg:w-[25%] max-h-[70vh]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">Episodes</h3>
            <div className="flex bg-[#2a2a2f] rounded-md">
              <button
                className={`p-2 transition ${layout === "row" ? "bg-primary text-black" : "text-white"}`}
                onClick={() => setLayout("row")}
              >
                <MdTableRows size={18} />
              </button>
              <button
                className={`p-2 transition ${layout === "column" ? "bg-primary text-black" : "text-white"}`}
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

        {/* Player */}
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
      </div>
    </div>
  );
};

export default WatchPage;
