import React, { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Image from "../components/Image";
import { Link } from "react-router-dom";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("continueWatching")) || [];
    setWatchList(stored);
  }, []);

  if (watchList.length === 0) return null;

  return (
    <div className="mt-10 px-2">
      <Heading>Continue Watching</Heading>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {watchList.map((anime) => (
          <div
            key={anime.id}
            className="min-w-[130px] sm:min-w-[160px] flex-shrink-0"
          >
            <Link to={`/watch/${anime.id}?ep=${anime.episode}`}>
              <div className="relative">
                <Image data={anime} />
                <div className="absolute bottom-1 left-1 bg-black/70 px-2 py-[2px] text-xs rounded">
                  Ep {anime.episode}
                </div>
              </div>
              <p className="text-gray-300 text-xs mt-2 line-clamp-2">
                {anime.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
