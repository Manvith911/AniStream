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
    <main className={`relative min-h-screen bg-[#0a0a0f] text-white ${bigPoster ? "overflow-hidden h-dvh" : ""}`}>
      {/* Big Poster Overlay */}
      {bigPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-5xl w-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/20 animate-scaleIn">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute top-4 right-4 p-2 bg-black/70 rounded-full text-white hover:text-pink-400 transition-all"
            >
              <FaWindowClose className="text-3xl" />
            </button>
            <img
              src={bigPoster}
              alt="poster"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <Helmet>
        <title>{titleId} | AnimeRealm</title>
        <meta property="og:title" content={`${titleId} - AnimeRealm`} />
      </Helmet>

      {/* Loader */}
      {isLoading && <Loader className="h-[100dvh]" />}

      {/* Main Content */}
      {!isLoading && data && (
        <>
          {/* Cinematic Background */}
          <div
            className="absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center brightness-[0.4] blur-sm"
            style={{ backgroundImage: `url(${data.coverImage || data.image || ""})` }}
          ></div>

          <div className={`relative z-10 pt-32 pb-10 px-4 md:px-8 xl:px-20`}>
            <InfoLayout showBigPoster={showBigPoster} data={data} />

            <div className="grid grid-cols-12 gap-8 mt-10 items-start">
              {/* LEFT CONTENT */}
              <div className="col-span-12 xl:col-span-9 flex flex-col gap-10">
                {data.moreSeasons?.length > 0 && (
                  <section className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:border-pink-500/40 hover:shadow-[0_0_20px_#ec4899]/30 animate-fadeUp delay-100">
                    <h2 className="text-2xl font-semibold mb-3 text-purple-400">More Seasons</h2>
                    <MoreSeasons data={data.moreSeasons} />
                  </section>
                )}

                <div className="animate-fadeUp delay-200">
                  <VoiceActorsLayout id={id} />
                </div>

                {data.recommended && (
                  <section className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:border-purple-500/40 hover:shadow-[0_0_20px_#a855f7]/30 animate-fadeUp delay-300">
                    <h2 className="text-2xl font-semibold mb-3 text-pink-400">Recommended Anime</h2>
                    <Recommended data={data.recommended} />
                  </section>
                )}
              </div>

              {/* RIGHT CONTENT */}
              <aside className="col-span-12 xl:col-span-3 flex flex-col gap-6">
                {data.related?.length > 0 && (
                  <section className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:border-blue-500/40 hover:shadow-[0_0_20px_#3b82f6]/30 animate-fadeUp delay-400">
                    <h2 className="text-xl font-semibold mb-3 text-blue-400">Related Anime</h2>
                    <Related data={data.related} />
                  </section>
                )}

                {data.mostPopular && (
                  <section className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:border-yellow-400/40 hover:shadow-[0_0_20px_#facc15]/30 animate-fadeUp delay-500">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-400">Most Popular</h2>
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
