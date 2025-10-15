/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import SoundsInfo from "./SoundsInfo";

const MiniPoster = ({ item }) => {
  return (
    <div className="flex border-b border-lightBg last:border-none pb-3 items-center gap-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
      <Link to={`/anime/${item.id}`} className="flex-shrink-0 w-16 relative overflow-hidden rounded-md bg-white pb-[85px] block">
        <img
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={item.poster}
          alt={item.title}
          loading="lazy"
        />
      </Link>
      <div className="text flex flex-col justify-center">
        <Link to={`/anime/${item.id}`}>
          <h2 className="title font-bold mb-2 text-gray-900 hover:text-primary transition-colors truncate">
            {item.title}
          </h2>
        </Link>
        <div className="item flex items-center text-xs text-gray-500">
          <SoundsInfo episodes={item.episodes} />
          {item.type && (
            <>
              <span className="mx-2 inline-block h-1 w-1 bg-primary rounded-full"></span>
              <span>{item.type}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniPoster;
