import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Loader from "../components/Loader";
import HeroBanner from "../components/HeroBanner";
import TrendingLayout from "../layouts/TrendingLayout";
import DynamicLayout from "../layouts/DynamicLayout";
import MainLayout from "../layouts/MainLayout";
import GenresLayout from "../layouts/GenresLayout";
import Top10Layout from "../layouts/Top10Layout";
import TopUpcomingLayout from "../layouts/TopUpcomingLayout";
import Footer from "../components/Footer";
import { useApi } from "../services/useApi";
import useGenresStore from "../store/genresStore";
import useTopTenStore from "../store/toptenStore";
import notify from "../utils/Toast";
import { genres } from "../utils/genres";

const Home = () => {
  const { data, isLoading, error, isError } = useApi("/home");
  const setGenres = useGenresStore((state) => state.setGenres);
  const setTopTen = useTopTenStore((state) => state.setTopTen);

  // Set static genres on mount
  useEffect(() => {
    setGenres(genres);
  }, []);

  // Update Top 10 list when data loads
  useEffect(() => {
    if (data?.data) setTopTen(data.data.top10);
  }, [data]);

  if (isError) {
    notify("error", error.message);
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0a0a13] to-[#0a0a0f] text-white">
      {/* SEO */}
      <Helmet>
        <title>
          Watch Anime Online, Free Anime Streaming Online on AnimeRealm
        </title>
        <meta
          name="description"
          content="AnimeRealm.to is a free, no-ads anime streaming site. Watch subbed and dubbed anime online in HD — latest episodes, trending shows, and more!"
        />
        <meta property="og:title" content="Home - AnimeRealm" />
      </Helmet>

      {/* Loading State */}
      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <>
          {/* Hero Banner */}
          <HeroBanner slides={data?.data?.spotlight} />

          <div className="xl:mx-10 mt-6">
            {/* Trending Section */}
            <TrendingLayout data={data?.data?.trending} />

            {/* Dynamic Grids */}
            <div className="grid grid-cols-12 gap-6 mx-2 my-10">
              <DynamicLayout
                title="Top Airing"
                endpoint="top-airing"
                data={data?.data?.topAiring}
              />
              <DynamicLayout
                title="Most Popular"
                endpoint="most-popular"
                data={data?.data?.mostPopular}
              />
              <DynamicLayout
                title="Most Favorite"
                endpoint="most-favorite"
                data={data?.data?.mostFavorite}
              />
              <DynamicLayout
                title="Latest Completed"
                endpoint="completed"
                data={data?.data?.latestCompleted}
              />
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-12 gap-8 my-16 px-2">
              {/* Left Column */}
              <div className="col-span-12 xl:col-span-9 space-y-10">
                <MainLayout
                  title="Latest Episodes"
                  endpoint="recently-updated"
                  data={data?.data?.latestEpisode}
                />
                <MainLayout
                  title="Newly Added"
                  endpoint="recently-added"
                  data={data?.data?.newAdded}
                />
                <TopUpcomingLayout data={data?.data?.topUpcoming} />
              </div>

              {/* Right Sidebar */}
              <aside className="col-span-12 xl:col-span-3 space-y-6">
                <GenresLayout />
                <Top10Layout />
              </aside>
            </div>

            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
