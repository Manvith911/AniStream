import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { motion } from "framer-motion";

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
      className={`relative min-h-screen bg-[#0a0a0f] text-white ${
        bigPoster ? "overflow-hidden h-dvh" : ""
      }`}
    >
      {/* --- Big Poster Overlay --- */}
      {bigPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
          <div className="relative max-w-5xl w-[90%] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setBigPoster(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:text-pink-400 transition"
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

      {/* --- Meta --- */}
      <Helmet>
        <title>{titleId} | AnimeRealm</title>
        <meta property="og:title" content={`${titleId} - AnimeRealm`} />
      </Helmet>

      {/* --- Loader --- */}
      {isLoading && <Loader className="h-[100dvh]" />}

      {/* --- Main Content --- */}
      {!isLoading && data && (
        <>
          {/* Background Image / Gradient Overlay */}
          <div
            className="absolute top-0 left-0 w-full h-[40vh] overflow-hidden"
            style={{
              backgroundImage: `url(${data.coverImage || data.image || ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(40%) blur(5px)",
            }}
          ></div>

          {/* Content Container */}
          <div className={`relative z-10 pt-32 pb-10 px-4 md:px-8 xl:px-20`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <InfoLayout showBigPoster={showBigPoster} data={data} />
            </motion.div>

            <div className="grid grid-cols-12 gap-8 mt-10 items-start">
              {/* --- LEFT --- */}
              <div className="col-span-12 xl:col-span-9 flex flex-col gap-10">
                {data.moreSeasons?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <h2 className="text-2xl font-semibold mb-3 text-purple-400">
                      More Seasons
                    </h2>
                    <MoreSeasons data={data.moreSeasons} />
                  </motion.section>
                )}

                <VoiceActorsLayout id={id} />

                {data.recommended && (
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <h2 className="text-2xl font-semibold mb-3 text-pink-400">
                      Recommended Anime
                    </h2>
                    <Recommended data={data.recommended} />
                  </motion.section>
                )}
              </div>

              {/* --- RIGHT --- */}
              <aside className="col-span-12 xl:col-span-3 flex flex-col gap-6">
                {data.related?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <h2 className="text-xl font-semibold mb-3 text-blue-400">
                      Related Anime
                    </h2>
                    <Related data={data.related} />
                  </motion.section>
                )}

                {data.mostPopular && (
                  <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <h2 className="text-xl font-semibold mb-3 text-yellow-400">
                      Most Popular
                    </h2>
                    <MostPopular data={data.mostPopular} />
                  </motion.section>
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
