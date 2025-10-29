import React, { useState } from "react";
import useTopTenStore from "../store/toptenStore";
import MiniPoster from "../components/MiniPoster";
import Heading from "../components/Heading";

const Top10Layout = () => {
  const [selectedTab, setSelectedTab] = useState("today");
  const tabs = [{ name: "today" }, { name: "week" }, { name: "month" }];
  const topTen = useTopTenStore((state) => state.topTen);

  const handleTabChange = (name) => {
    if (selectedTab !== name) setSelectedTab(name);
  };

  return (
    <div className="mx-2 mt-14 overflow-x-hidden">
      {/* Header with Tabs */}
      <div className="infor flex mb-2 justify-between items-center flex-wrap gap-2">
        <Heading className="ml-0">Top 10</Heading>
        <div className="buttons flex bg-lightbg rounded-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`${
                selectedTab === tab.name
                  ? "bg-primary text-black"
                  : "hover:text-primary"
              } px-4 py-1.5 rounded-md capitalize transition-colors duration-200`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Box containing Top 10 list */}
      <div className="box bg-lightbg px-2 sm:px-4 py-3 rounded-md">
        {topTen[selectedTab]?.length ? (
          topTen[selectedTab].map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 sm:gap-5 py-2 flex-wrap sm:flex-nowrap w-full border-b border-gray-700/40 last:border-none"
            >
              <h1
                className={`rank text-base sm:text-2xl font-extrabold shrink-0 ${
                  item.rank <= 3 ? "border-primary border-b-2" : ""
                }`}
              >
                {item.rank < 10 ? `0${item.rank}` : item.rank}
              </h1>
              <div className="flex-grow min-w-0">
                <MiniPoster item={item} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm sm:text-base py-4 text-center">
            No items available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Top10Layout;
