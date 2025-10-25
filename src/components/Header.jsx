import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();

  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedValue(newValue), 500);
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="cursor-pointer" onClick={sidebarHandler}>
                <FaBars size={25} />
              </div>
              <Logo />
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:max-w-[400px]">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-[#FBF8EF] px-3 py-1 rounded-md w-full"
              >
                <input
                  value={value}
                  onChange={changeInput}
                  placeholder="Search anime"
                  type="text"
                  className="bg-transparent flex-1 text-black text-sm focus:outline-none"
                />
                {value.length > 1 && (
                  <button onClick={resetSearch} type="reset" className="text-black">
                    <FaXmark />
                  </button>
                )}
                <button type="submit" className="text-black">
                  <FaSearch />
                </button>
              </form>

              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-card z-50 rounded-md shadow-lg">
                  {isLoading ? (
                    <Loader />
                  ) : data && data?.data.length ? (
                    <>
                      {data.data.map((item) => (
                        <div
                          onClick={() => navigateToAnimePage(item.id)}
                          className="flex items-start bg-backGround hover:bg-lightBg px-3 py-4 gap-4 cursor-pointer"
                          key={item.id}
                        >
                          <img
                            className="w-10 h-14 rounded-sm object-cover"
                            src={item.poster}
                            alt={item.title}
                          />
                          <div className="info">
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {item.title}
                            </h4>
                            <h6 className="text-xs text-gray-400 line-clamp-1">
                              {item.alternativeTitle}
                            </h6>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{item.aired}</span>
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              <span>{item.type}</span>
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        className="py-2 flex justify-center items-center gap-2 bg-primary text-black w-full"
                        onClick={handleSubmit}
                      >
                        <span className="text-sm font-bold">View More</span>
                        <FaArrowCircleRight />
                      </button>
                    </>
                  ) : (
                    <h1 className="text-center text-sm text-primary py-3">
                      Anime not found :(
                    </h1>
                  )}
                </div>
              )}
            </div>

            {/* Right: Auth / Profile */}
            <div className="flex items-center">
              {!session ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-primary text-black px-4 py-1 rounded-md font-semibold"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <img
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    src={
                      profile?.avatar_url ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary object-cover"
                  />
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-card rounded-md shadow-md w-40">
                      <button
                        onClick={() => navigate("/profile")}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => navigate("/watchlist")}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg"
                      >
                        Watchlist
                      </button>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
