/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";
import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import Heading from "../components/Heading";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const ListPage = () => {
  const validateQueries = [
    "top-airing",
    "most-popular",
    "most-favorite",
    "completed",
    "recently-added",
    "recently-updated",
    "top-upcoming",
    "subbed-anime",
    "dubbed-anime",
    "movie",
    "tv",
    "ova",
    "ona",
    "special",
    "az-list",
    "genre",
    "producer",
  ];

  const { category, query = null } = useParams();
  const isValidQuery = validateQueries.includes(category);

  if (!isValidQuery) return <PageNotFound />;

  const endpoint = `/animes/${category}${query ? `/${query}` : ""}?page=`;
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteApi(endpoint);

  if (isError) return <PageNotFound />;

  const pages = data?.pages;

  return (
    <div className="list-page pt-20 px-4 md:px-8 bg-[#0e0e0e] min-h-screen text-white">
      <Helmet>
        <title>
          {query ? `${query} Anime` : `${category.replace("-", " ")} Anime`} - Gojo
        </title>
        <meta property="og:title" content={`${category} - Gojo`} />
      </Helmet>

      {/* Page Heading */}
      <div className="flex justify-between items-center mb-8">
        <Heading className="text-3xl font-extrabold tracking-wide text-white drop-shadow-md capitalize">
          {query ? query.replace("-", " ") : category.replace("-", " ")} Anime
        </Heading>
      </div>

      {/* Anime Grid with Infinite Scroll */}
      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={data?.pages.flat().length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader className="h-fit" />}
          endMessage={<Footer />}
        >
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.response.map((item, index) => (
                  <div
                    key={item.id + index}
                    className="group relative rounded-2xl overflow-hidden bg-[#161616] hover:bg-[#1e1e1e] transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    {/* Image */}
                    <div className="relative w-full h-0 pb-[60%] overflow-hidden">
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Episode Tag */}
                      {item.episode && (
                        <div className="absolute top-2 right-2 bg-sky-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          Ep {item.episode}
                        </div>
                      )}

                      {/* Hover Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="none"
                            className="w-6 h-6"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h3
                        title={item.title}
                        className="text-base sm:text-lg font-semibold text-gray-100 truncate group-hover:text-sky-400 transition-colors duration-300"
                      >
                        {item.title}
                      </h3>
                      {item.genres && (
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                          {item.genres.join(" • ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <Loader className="h-[100dvh]" />
      )}
    </div>
  );
};

export default ListPage;
