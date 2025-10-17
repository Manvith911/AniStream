/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useParams } from "react-router-dom";
import { useInfiniteApi } from "../services/useApi";
import Loader from "../components/Loader";
import PageNotFound from "./PageNotFound";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "../components/Image";
import Heading from "../components/Heading";
import AZ from "../layouts/AZ";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const ListPage = () => {
  // List of valid categories/queries
  const validCategories = [
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

  // Validate category param
  const isValidCategory = validCategories.includes(category);

  if (!isValidCategory) {
    return <PageNotFound />;
  }

  // Compose API endpoint for infinite loading
  const endpoint = `/animes/${category}${query ? `/${query}` : ""}?page=`;

  // Fetch data with infinite scroll hook
  const {
    data,
    isError,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteApi(endpoint);

  if (isError) {
    return <PageNotFound />;
  }

  const pages = data?.pages;

  return (
    <div className="list-page pt-14">
      <Helmet>
        <title>{`${category}${query ? ` - ${query}` : ""} Anime - AnimeRealm`}</title>
        <meta property="og:title" content="Explore - AnimeRealm" />
      </Helmet>

      {/* Special layout for A-Z list */}
      {category === "az-list" && <AZ selected={query} />}

      {pages && !isLoading ? (
        <InfiniteScroll
          dataLength={pages.flat().length || 0} // Important for infinite scroll
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader className="h-fit" />}
          endMessage={<Footer />}
        >
          <Heading>
            {/* Only show category and query if available */}
            {category !== "az-list" && (
              <>
                {category.replace(/-/g, " ")}
                {query ? ` - ${query}` : ""}
                {" Anime"}
              </>
            )}
          </Heading>

          <div className="flex flex-wrap justify-around items-center gap-4">
            {pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.data.response.map((item) => (
                  <div key={item.id} className="flw-item">
                    <Image data={item} />
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
