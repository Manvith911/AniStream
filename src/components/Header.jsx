import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(newValue);
    }, 500);
  };

  const { data, isLoading } = useApi(
    debouncedValue.length > 2 ? `/suggestion?keyword=${debouncedValue}` : null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim().length > 0) {
      navigate(`/search?keyword=${value}`);
      resetSearch();
    }
  };

  const navigateToAnimePage = (id) => {
    navigate(`/anime/${id}`);
    resetSearch();
  };

  const resetSearch = () => {
    setValue("");
    setDebouncedValue("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const emptyInput = () => {
    setValue("");
    setDebouncedValue("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-5 md:px-10">
          {/* Top row: Sidebar, Logo, Search Bar */}
          <div className="flex items-center justify-between gap-4 w-full flex-wrap">
            {/* Left side: menu + logo + search bar */}
            <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
              <div className="menu cursor-pointer" onClick={sidebarHandler}>
                <FaBars size={25} />
              </div>

              {/* Logo */}
              <Logo />

              {/* Search Bar (inline with logo) */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-[#FBF8EF] px-3 py-1 rounded-md w-full md:w-[300px] lg:w-[400px]"
              >
                <input
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime"
                  type="text"
                  className="bg-transparent flex-1 text-black text-sm focus:outline-none"
                />
                {value.length > 1 && (
                  <button
                    onClick={emptyInput}
                    type="reset"
                    className="text-black"
                  >
                    <FaXmark />
                  </button>
                )}
                <button type="submit" className="text-black">
                  <FaSearch />
                </button>
              </form>
            </div>
          </div>

          {/* Search Suggestions */}
          {debouncedValue.length > 2 && (
            <div className="mt-2 flex flex-col bg-card z-50 w-full max-w-[400px] rounded-md overflow-hidden shadow-lg">
              {isLoading ? (
                <Loader />
              ) : data && data?.data.length ? (
                <>
                  {data?.data?.map((item) => (
                    <div
                      onClick={() => navigateToAnimePage(item.id)}
                      className="flex w-full justify-start items-start bg-backGround hover:bg-lightBg px-3 py-5 gap-4 cursor-pointer"
                      key={item.id}
                    >
                      <div className="poster shrink-0 pb-14 relative w-10">
                        <img
                          className="h-full w-full inset-0 absolute object-cover object-center"
                          src={item.poster}
                          alt={item.title}
                        />
                      </div>
                      <div className="info">
                        <h4 className="title line-clamp-2">{item.title}</h4>
                        <h6 className="gray text-sm line-clamp-1">
                          {item.alternativeTitle}
                        </h6>
                        <div className="flex items-center gap-2 text-sm gray">
                          <h6>{item.aired}</h6>
                          <span className="h-1 w-1 rounded-full bg-primary"></span>
                          <h6>{item.type}</h6>
                          <span className="h-1 w-1 rounded-full bg-primary"></span>
                          <h6>{item.duration}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="py-2 flex justify-center items-center gap-2 bg-primary text-black"
                    onClick={handleSubmit}
                  >
                    <span className="text-lg font-bold">View More</span>
                    <FaArrowCircleRight />
                  </button>
                </>
              ) : (
                <h1 className="text-center text-lg text-primary p-3">
                  Anime not found :(
                </h1>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
