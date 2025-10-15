import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Loader from "../components/Loader";
import HeroBanner from "../components/HeroBanner";
import MainLayout from "../layouts/MainLayout"; // Reusable carousel layout
import DynamicLayout from "../layouts/DynamicLayout";
import GenresLayout from "../layouts/GenresLayout";
import Top10Layout from "../layouts/Top10Layout";
import LatestEpisodesLayout from "../layouts/LatestEpisodesLayout"; // Keep this separate
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

  useEffect(() => {
    setGenres(genres);
  }, [setGenres]);

  useEffect(() => {
    if (data?.data) setTopTen(data.data.top10);
  }, [data, setTopTen]);

  if (isError) {
    notify("error", error.message);
    return null;
  }

  const homeData = data?.data;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0a0a13] to-[#0a0a0f] text-white">
      {/* SEO Meta */}
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

      {isLoading ? (
        <Loader className="h-[100dvh]" />
      ) : (
        <>
          {/* Hero Section */}
          <HeroBanner slides={homeData?.spotlight} />

          <div className="xl:mx-10 mt-6">
            {/* Trending Section using MainLayout */}
            <MainLayout
              title="Trending Now"
              data={homeData?.trending}
              label="Trending"
            />

            {/* Dynamic Grids Section */}
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

            {/* Main Content Area */}
            <div className="grid grid-cols-12 gap-8 my-16 px-2">
              {/* Left Column */}
              <div className="col-span-12 xl:col-span-9 space-y-10">
                {/* Keep LatestEpisodesLayout separate */}
                <LatestEpisodesLayout
                  title="Latest Episodes"
                  endpoint="recently-updated"
                  data={homeData?.latestEpisode}
                />

                {/* Reusable MainLayout for other sections */}
                <MainLayout
                  title="Newly Added"
                  data={homeData?.newAdded}
                  label="New"
                />
                <MainLayout
                  title="Top Upcoming"
                  data={homeData?.topUpcoming}
                  label="Upcoming"
                />
              </div>

              {/* Right Sidebar */}
              <aside className="col-span-12 xl:col-span-3 space-y-6">
                <GenresLayout />
                <Top10Layout />
              </aside>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
