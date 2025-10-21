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
    <div className="mt-10">
      <Heading>Continue Watching</Heading>
      <div className="flex justify-around flex-wrap gap-4">
        {watchList.map((anime) => (
          <div key={anime.id} className="flw-item">
            <Link to={`/watch/${anime.id}`}>
              <Image data={anime} />
              <p className="text-center text-sm mt-2 text-gray-300">
                Episode {anime.episode}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
