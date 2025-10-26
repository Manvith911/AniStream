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
    <div className="bg-[#0b0b10] min-h-screen pt-16 text-white px-4 md:px-10">
      <Helmet>
        <title>
          Watch {animeDetails?.title || id.split("-").slice(0, 2).join(" ")} Online - AnimeRealm
        </title>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 mb-5 text-sm text-gray-300">
        <Link to="/home" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <Link
          to={`/anime/${id}`}
          className="hover:text-primary capitalize transition-colors"
        >
          {animeDetails?.title || id.split("-").slice(0, 2).join(" ")}
        </Link>
        <span className="h-1 w-1 rounded-full bg-primary"></span>
        <h4 className="gray">Episode {currentEp?.episodeNumber}</h4>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Episodes list */}
        <div className="bg-[#18181f] rounded-xl p-4 overflow-y-auto lg:w-[22%] max-h-[75vh] shadow-lg">
          <h3 className="text-white font-semibold mb-3 text-sm tracking-wide">
            Episodes
          </h3>
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

        {/* Right - Big Player */}
        <div className="flex-1 bg-[#101014] rounded-xl overflow-hidden shadow-2xl h-[75vh]">
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

      {/* Anime details section */}
      <div className="bg-[#18181f] mt-8 rounded-xl p-6 shadow-xl">
        {loadingDetails ? (
          <Loader className="h-40" />
        ) : animeDetails ? (
          <>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
              <img
                src={animeDetails.poster}
                alt={animeDetails.title}
                className="rounded-lg w-40 h-auto shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-3">
                  {animeDetails.title}
                </h2>
                <div className="flex flex-wrap text-xs text-gray-400 gap-2 mb-3">
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
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {animeDetails.synopsis}
                </p>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>
                    <strong>Genres:</strong> {animeDetails.genres?.join(", ")}
                  </div>
                  <div>
                    <strong>Studio:</strong> {animeDetails.studios}
                  </div>
                  <div>
                    <strong>Status:</strong> {animeDetails.status}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No details available.</p>
        )}
      </div>

      {/* Recommended section */}
      {animeDetails?.recommended && (
        <div className="mt-10">
          <Recommended data={animeDetails.recommended} />
        </div>
      )}
    </div>
  );
};

export default WatchPage;
