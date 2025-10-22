import { useEffect, useRef, useState } from "react";
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
  const [showMenu, setShowMenu] = useState(false);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { session, profile, logout } = useAuth();

  // Debounce search
  const changeInput = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Sidebar + Logo */}
            <div className="flex items-center gap-3">
              <div className="cursor-pointer" onClick={sidebarHandler}>
                <FaBars size={25} />
              </div>
              <Logo />
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:ml-6 sm:max-w-[400px]">
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
                  <button
                    onClick={resetSearch}
                    type="button"
                    className="text-black"
                  >
                    <FaXmark />
                  </button>
                )}
                <button type="submit" className="text-black">
                  <FaSearch />
                </button>
              </form>

              {/* Search Suggestion Dropdown */}
              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-card rounded-md overflow-hidden shadow-lg z-50">
                  {isLoading ? (
                    <Loader />
                  ) : data?.data?.length ? (
                    <>
                      {data.data.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateToAnimePage(item.id)}
                          className="flex items-start bg-backGround hover:bg-lightBg px-3 py-4 gap-4 cursor-pointer"
                        >
                          <img
                            className="w-10 h-14 object-cover rounded-sm"
                            src={item.poster}
                            alt={item.title}
                          />
                          <div>
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {item.title}
                            </h4>
                            <h6 className="text-xs gray line-clamp-1">
                              {item.alternativeTitle}
                            </h6>
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
                    <p className="text-center text-sm text-primary py-3">
                      Anime not found :(
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Profile / Login */}
            <div className="relative" ref={menuRef}>
              {session ? (
                <div className="relative flex items-center">
                  <img
                    onClick={() => setShowMenu((prev) => !prev)}
                    src={
                      profile?.avatar_url && profile.avatar_url.trim() !== ""
                        ? profile.avatar_url
                        : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer border border-primary bg-gray-700"
                  />

                  {showMenu && (
                    <div className="absolute right-0 top-12 bg-card border border-gray-700 shadow-md rounded-md w-40 p-2 z-[9999]">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-lightBg rounded-md"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/watchlist");
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-lightBg rounded-md"
                      >
                        Watchlist
                      </button>
                      <button
                        onClick={async () => {
                          setShowMenu(false);
                          await logout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-600 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="px-4 py-2 bg-primary text-black font-semibold rounded-md hover:opacity-80"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
