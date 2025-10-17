import { useEffect } from "react";
import { Helmet } from "react-helmet";

import Loader from "../components/Loader";
import HeroBanner from "../components/HeroBanner";
import MainLayout from "../layouts/MainLayout";
import DynamicLayout from "../layouts/DynamicLayout";
import GenresLayout from "../layouts/GenresLayout";
import Top10Layout from "../layouts/Top10Layout";
import LatestEpisodesLayout from "../layouts/LatestEpisodesLayout";
import Footer from "../components/Footer";

import { useApi } from "../services/useApi";
import useGenresStore from "../store/genresStore";
import useTopTenStore from "../store/toptenStore";

import notify from "../utils/Toast";
import { genres } from "../utils/genres";

const Home = () => {
  // --- Fetch home page static data ---
  const { data, isLoading, error, isError } = useApi("/home");

  // --- Fetch latest episodes with hourly refresh ---
  const {
    data: latestEpisodes,
    isLoading: isLatestLoading,
    isFetching: isRefreshing,
  } = useApi("/animes/recently-updated", {
    refetchInterval: 3600000, // 1 hour
  });

  // --- Set stores ---
  const setGenres = useGenresStore((state) => state.setGenres);
  const setTopTen = useTopTenStore((state) => state.setTopTen);

  useEffect(() => {
    setGenres(genres);
  }, [setGenres]);

  useEffect(() => {
    if (data?.data) {
      setTopTen(data.data.top10);
    }
  }, [data, setTopTen]);

  // --- Handle errors ---
  if (isError) {
    notify("error", error.message);
    return null;
  }

  const homeData = data?.data;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0a0a13] to-[#0a0a0f] text-white">
      {/* --- SEO --- */}
      <Helmet>
        <title>
          Watch Anime Online, Free Anime Streaming Online on AnimeRealm Anime Website
        </title>
        <meta
          name="description"
          content="AnimeRealm is a free no-ads anime site to watch free anime. Online anime streaming at AnimeRealm with DUB, SUB in HD."
        />
        <meta property="og:title" content="Home - AnimeRealm" />
      </Helmet>

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <>
          {/* --- Hero Section --- */}
          <HeroBanner slides={homeData?.spotlight} />

          <div className="xl:mx-10 mt-6">
            {/* --- Trending Section --- */}
            <MainLayout
              title="Trending Now"
              data={homeData?.trending}
              endpoint="trending"
              label="Trending"
            />

            {/* --- Dynamic 4-grid Sections --- */}
            <div className="grid grid-cols-12 gap-6 mx-2 my-10">
              <DynamicLayout
                title="Top Airing"
                endpoint="top-airing"
                data={homeData?.topAiring}
              />
              <DynamicLayout
                title="Most Popular"
                endpoint="most-popular"
                data={homeData?.mostPopular}
              />
              <DynamicLayout
                title="Most Favorite"
                endpoint="most-favorite"
                data={homeData?.mostFavorite}
              />
              <DynamicLayout
                title="Latest Completed"
                endpoint="completed"
                data={homeData?.latestCompleted}
              />
            </div>

            {/* --- Main Content + Sidebar --- */}
            <div className="grid grid-cols-12 gap-8 my-16 px-2">
              {/* LEFT: Main anime feeds */}
              <div className="col-span-12 xl:col-span-9 space-y-10 overflow-hidden">
                {/* --- Latest Episodes --- */}
                {isLatestLoading ? (
                  <Loader className="h-40" />
                ) : (
                  <div className="relative">
                    {isRefreshing && (
                      <div className="absolute -top-6 right-2 text-xs text-sky-400 animate-pulse">
                        Refreshing...
                      </div>
                    )}
                    <LatestEpisodesLayout
                      title="Latest Episodes"
                      endpoint="recently-updated"
                      data={Array.isArray(latestEpisodes?.data)
                        ? latestEpisodes.data
                        : []} // Safe check
                    />
                  </div>
                )}

                {/* --- Newly Added --- */}
                <div className="w-full overflow-hidden">
                  <MainLayout
                    title="Newly Added"
                    data={homeData?.newAdded}
                    endpoint="recently-added"
                    label="New"
                  />
                </div>

                {/* --- Top Upcoming --- */}
                <div className="w-full overflow-hidden">
                  <MainLayout
                    title="Top Upcoming"
                    data={homeData?.topUpcoming}
                    endpoint="top-upcoming"
                    label="Upcoming"
                  />
                </div>
              </div>

              {/* RIGHT: Sidebar */}
              <aside className="col-span-12 xl:col-span-3 space-y-6 z-[40]">
                <GenresLayout />
                <Top10Layout />
              </aside>
            </div>

            {/* --- Footer --- */}
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
