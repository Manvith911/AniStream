import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { Helmet } from "react-helmet";

import PageNotFound from "./PageNotFound";
import Loader from "../components/Loader";
import InfoLayout from "../layouts/InfoLayout";
import Recommended from "../layouts/Recommended";
import MostPopular from "../layouts/MostPopular";
import MoreSeasons from "../layouts/MoreSeasons";
import Related from "../layouts/Related";
import VoiceActorsLayout from "../layouts/VoiceActorsLayout";
import Footer from "../components/Footer";
import { useApi } from "../services/useApi";

const DetailPage = () => {
  const { id } = useParams();
  const [bigPoster, setBigPoster] = useState(null);

  const titleId = id.split("-").slice(0, -1).join(" ").replace(",", " ");
  const isValidId = /\d$/.test(id);

  if (!isValidId) return <PageNotFound />;

  const { data: response, isError, isLoading } = useApi(`/anime/${id}`);
  const data = response?.data;

  if (isError) return <PageNotFound />;

  const showBigPoster = (url) => setBigPoster(url);

  return (
    <main
      className={`relative min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f] text-white transition-all duration-300 ${
        bigPoster ? "overflow-hidden h-dvh" : ""
      }`}
    >
      {/* Big Poster Overlay */}
      {bigPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg animate-fadeIn">
          <div className="relative max-w-5xl w-[90%] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/10 scale-100 hover:scale-[1.01] transition-transform">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute top-4 right-4 p-2 bg-black/70 rounded-full text-white hover:text-pink-400 hover:scale-110 transition-all"
            >
              <FaWindowClose className="text-3xl" />
            </button>
            <img
              src={bigPoster}
              alt="poster"
              className="w-full h-auto object-contain bg-black/40"
            />
          </div>
        </div>
      )}

      {/* Meta Tags */}
      <Helmet>
        <title>{titleId} | AniStream</title>
        <meta property="og:title" content={`${titleId} - AniStream`} />
      </Helmet>

      {/* Loader */}
      {isLoading && <Loader className="h-[100dvh]" />}

      {/* Main Content */}
      {!isLoading && data && (
        <>
          {/* Cinematic Background */}
          <div
            className="absolute top-0 left-0 w-full h-[45vh] bg-cover bg-center brightness-[0.4] blur-sm transition-all duration-500"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(10,10,15,0.1), rgba(10,10,15,1)), url(${data.coverImage || data.image || ""})`,
            }}
          ></div>

          <div className="relative z-10 pt-40 pb-16 px-4 md:px-10 xl:px-24">
            {/* Anime Info */}
            <InfoLayout showBigPoster={showBigPoster} data={data} />

            {/* Grid Layout */}
            <div className="grid grid-cols-12 gap-10 mt-12 items-start">
              {/* LEFT SECTION */}
              <div className="col-span-12 xl:col-span-9 flex flex-col gap-10">
                {data.moreSeasons?.length > 0 && (
                  <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:border-pink-400/40 hover:shadow-[0_0_25px_#ec4899]/30 transition-all duration-300">
                    <h2 className="text-2xl font-semibold mb-3 text-pink-400 tracking-wide">
                      More Seasons
                    </h2>
                    <MoreSeasons data={data.moreSeasons} />
                  </section>
                )}

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:border-purple-400/40 hover:shadow-[0_0_25px_#a855f7]/30 transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-3 text-purple-400 tracking-wide">
                    Voice Actors
                  </h2>
                  <VoiceActorsLayout id={id} />
                </div>

                {data.recommended && (
                  <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:border-indigo-400/40 hover:shadow-[0_0_25px_#6366f1]/30 transition-all duration-300">
                    <h2 className="text-2xl font-semibold mb-3 text-indigo-400 tracking-wide">
                      Recommended Anime
                    </h2>
                    <Recommended data={data.recommended} />
                  </section>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <aside className="col-span-12 xl:col-span-3 flex flex-col gap-6">
                {data.related?.length > 0 && (
                  <section className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:border-blue-400/40 hover:shadow-[0_0_25px_#3b82f6]/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold mb-3 text-blue-400">
                      Related Anime
                    </h2>
                    <Related data={data.related} />
                  </section>
                )}

                {data.mostPopular && (
                  <section className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:border-yellow-400/40 hover:shadow-[0_0_25px_#facc15]/30 transition-all duration-300">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-400">
                      Most Popular
                    </h2>
                    <MostPopular data={data.mostPopular} />
                  </section>
                )}
              </aside>
            </div>
          </div>
        </>
      )}

      <Footer />
    </main>
  );
};

export default DetailPage;
