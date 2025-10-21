import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Player from "../components/Player";
import Episodes from "../layouts/Episodes";
import { useApi } from "../services/useApi";
import PageNotFound from "./PageNotFound";
import { Helmet } from "react-helmet";
import { MdTableRows } from "react-icons/md";
import { HiMiniChevronLeft } from "react-icons/hi2";
import Recommended from "../layouts/Recommended";

const WatchPage = () => {
  const { animeId } = useParams();
  const [searchParams] = useSearchParams();
  const episodeId = searchParams.get("ep");
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await get(`/api/anime/${animeId}`);
        setAnimeDetails(data);
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId]);

  if (loading) return <Loader />;
  if (!animeDetails) return <PageNotFound />;

  const currentEpisode =
    animeDetails?.episodes?.find((ep) => ep.id === episodeId) ||
    animeDetails?.episodes?.[0];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 text-gray-200">
      <Helmet>
        <title>
          {animeDetails.title} - Episode {currentEpisode?.number || 1} | AnimeRealm
        </title>
      </Helmet>

      {/* Header / Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to={`/anime/${animeId}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <HiMiniChevronLeft className="text-xl" />
          Back
        </Link>
        <h1 className="text-lg font-semibold">{animeDetails.title}</h1>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Player + Episodes (larger area) */}
        <div className="flex-1 lg:w-[72%] space-y-6">
          <div className="bg-[#1a1a1f] p-3 rounded-2xl shadow-lg">
            <Player
              episodeId={currentEpisode?.id}
              sources={currentEpisode?.sources}
              title={`${animeDetails.title} - Episode ${currentEpisode?.number}`}
            />
          </div>

          {/* Episodes List */}
          {animeDetails?.episodes && (
            <div className="bg-[#1a1a1f] p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <MdTableRows className="text-primary text-xl" />
                <h2 className="font-semibold text-lg">Episodes</h2>
              </div>
              <Episodes episodes={animeDetails.episodes} />
            </div>
          )}
        </div>

        {/* Right - Anime Info (slightly smaller) */}
        <div className="lg:w-[28%] bg-[#1a1a1f] p-4 rounded-2xl shadow-md space-y-3">
          <h2 className="text-lg font-semibold text-primary">Anime Info</h2>

          <div className="text-sm text-gray-300 space-y-2">
            <p>
              <span className="text-gray-400">Type:</span> {animeDetails.type}
            </p>
            <p>
              <span className="text-gray-400">Status:</span> {animeDetails.status}
            </p>
            <p>
              <span className="text-gray-400">Episodes:</span>{" "}
              {animeDetails.episodes?.length || "?"}
            </p>
            <p>
              <span className="text-gray-400">Duration:</span>{" "}
              {animeDetails.duration || "?"}
            </p>
            <p>
              <span className="text-gray-400">Released:</span>{" "}
              {animeDetails.releaseDate || "?"}
            </p>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-sm text-gray-400 mb-1">Synopsis</h3>
            <p className="text-sm text-gray-300 line-clamp-6">
              {animeDetails.description}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {animeDetails?.recommended && (
        <Recommended data={animeDetails.recommended} />
      )}
    </div>
  );
};

export default WatchPage;
