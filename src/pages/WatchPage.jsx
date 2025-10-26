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

  return (
    <div className="bg-gradient-to-b from-[#0b0b0e] to-[#141519] min-h-screen pt-20 text-white px-4 md:px-10">
      <Helmet>
        <title>
          Watch {animeDetails?.title || id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 mb-6 text-sm text-gray-400">
        <Link to="/home" className="hover:text-primary transition">
          Home
        </Link>
        <span className="text-primary">›</span>
        <Link to={`/anime/${id}`} className="hover:text-primary capitalize transition">
          {animeDetails?.title || id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="text-primary">›</span>
        <span className="text-gray-300">Episode {currentEp?.episodeNumber}</span>
      </div>

      {/* 🔹 Player + Episodes */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Episodes Sidebar */}
        <div className="bg-[#1a1b20]/90 backdrop-blur-md rounded-2xl p-4 overflow-y-auto w-full lg:w-[25%] max-h-[78vh] border border-[#2a2a33] shadow-xl">
          <h3 className="text-white font-semibold mb-3 text-center text-sm uppercase tracking-wide">
            Episodes
          </h3>
          <ul
            className={`grid gap-2 ${
              layout === "row" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-2"
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

        {/* Big Video Player */}
        <div className="flex-1 bg-[#0f0f13] rounded-2xl overflow-hidden shadow-2xl h-[80vh] relative border border-[#2a2a33]">
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm text-gray-300 flex justify-between items-center">
            <span>
              Episode {currentEp?.episodeNumber} — {animeDetails?.title}
            </span>
            <span className="hidden sm:block text-primary font-medium tracking-wide">
              AnimeRealm
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Anime Info Below */}
      <div className="bg-[#1a1b20]/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[#2a2a33] mb-10">
        {loadingDetails ? (
          <Loader className="h-40" />
        ) : animeDetails ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={animeDetails.poster}
                alt={animeDetails.title}
                className="rounded-xl w-40 md:w-52 h-auto shadow-md border border-[#2a2a33]"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2 text-white">
                  {animeDetails.title}
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-gray-300 mb-3">
                  <span className="bg-[#2a2a33] px-3 py-1 rounded-md">
                    {animeDetails.rating}
                  </span>
                  <span className="bg-[#2a2a33] px-3 py-1 rounded-md">
                    {animeDetails.type}
                  </span>
                  <span className="bg-[#2a2a33] px-3 py-1 rounded-md">
                    {animeDetails.duration}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed text-justify">
                  {animeDetails.synopsis}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 text-xs text-gray-400 gap-y-1">
                  <p>
                    <strong>Genres:</strong> {animeDetails.genres?.join(", ")}
                  </p>
                  <p>
                    <strong>Studio:</strong> {animeDetails.studios}
                  </p>
                  <p>
                    <strong>Status:</strong> {animeDetails.status}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No details available.</p>
        )}
      </div>

      {/* 🔹 Recommended Section */}
      {animeDetails?.recommended && (
        <div className="mt-10">
          <Recommended data={animeDetails.recommended} />
        </div>
      )}
    </div>
  );
};

export default WatchPage;
