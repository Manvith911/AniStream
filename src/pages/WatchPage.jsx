import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { Helmet } from "react-helmet";
import Recommended from "../layouts/Recommended";

const WatchPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("row");
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
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
        const res = await fetch(`https://www.animerealm.in/api/anime/${id}`);
        const json = await res.json();
        if (json.success) setAnimeDetails(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Auto-select first episode
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

  // ✅ Save progress for Continue Watching
  useEffect(() => {
    if (animeDetails && currentEp) {
      const stored = JSON.parse(localStorage.getItem("continueWatching")) || [];

      const existingIndex = stored.findIndex(
        (item) => item.id === animeDetails.id
      );

      const newEntry = {
        id: animeDetails.id,
        title: animeDetails.title,
        episode: currentEp.episodeNumber,
        poster: animeDetails.poster,
      };

      if (existingIndex >= 0) {
        stored[existingIndex] = newEntry;
      } else {
        stored.unshift(newEntry);
      }

      localStorage.setItem(
        "continueWatching",
        JSON.stringify(stored.slice(0, 10)) // keep latest 10
      );
    }
  }, [animeDetails, currentEp]);

  return (
    <div className="bg-[#0f0f13] min-h-screen pt-16 text-white px-3 md:px-8">
      <Helmet>
        <title>
          Watch {animeDetails?.title || id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 mb-4 text-sm text-gray-300">
        <Link to="/home" className="hover:text-primary">
          Home
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize">
          {animeDetails?.title || id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Episodes List */}
        <div className="bg-[#1a1a1f] rounded-xl p-4 overflow-y-auto lg:w-[20%] max-h-[70vh] shadow-lg">
          <h3 className="text-white font-semibold mb-3 text-sm">Episodes</h3>
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

        {/* Center - Player */}
        <div className="flex-1 lg:w-[55%] bg-[#111] rounded-xl overflow-hidden shadow-2xl h-[70vh]">
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

        {/* Right - Anime Info */}
        <div className="bg-[#1a1a1f] rounded-xl p-5 lg:w-[25%] shadow-lg h-[70vh] overflow-y-auto">
          {loadingDetails ? (
            <Loader className="h-40" />
          ) : animeDetails ? (
            <>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={animeDetails.poster}
                  alt={animeDetails.title}
                  className="rounded-md w-36 h-auto mb-3 shadow-md"
                />
                <h2 className="text-lg font-semibold text-center">
                  {animeDetails.title}
                </h2>
              </div>
              <div className="flex flex-wrap text-xs text-gray-400 gap-2 mb-3 justify-center">
                <span className="bg-[#222] px-2 py-1 rounded">
                  {animeDetails.rating}
                </span>
                <span className="bg-[#222] px-2 py-1 rounded">
                  {animeDetails.type}
                </span>
                <span className="bg-[#222] px-2 py-1 rounded">
                  {animeDetails.duration}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3 leading-relaxed text-justify">
                {animeDetails.synopsis}
              </p>
              <div className="text-xs text-gray-400 mb-1">
                <strong>Genres:</strong> {animeDetails.genres?.join(", ")}
              </div>
              <div className="text-xs text-gray-400 mb-1">
                <strong>Studio:</strong> {animeDetails.studios}
              </div>
              <div className="text-xs text-gray-400">
                <strong>Status:</strong> {animeDetails.status}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No details available.</p>
          )}
        </div>
      </div>

      {/* ✅ Recommended Section */}
      {animeDetails?.recommended && (
        <Recommended data={animeDetails.recommended} />
      )}
    </div>
  );
};

export default WatchPage;
