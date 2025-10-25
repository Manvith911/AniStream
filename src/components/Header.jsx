// components/Header.jsx (updated)
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
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

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

  const onProfileClick = () => {
    setOpenProfileMenu((s) => !s);
  };

  const goToProfile = () => {
    navigate("/profile");
    setOpenProfileMenu(false);
  };

  const goToWatchlist = () => {
    navigate("/watchlist");
    setOpenProfileMenu(false);
  };

  const handleLogout = async () => {
    await signOut();
    setOpenProfileMenu(false);
  };

  // Helper to show avatar or initials
  const Avatar = ({ url, email }) => {
    if (url) {
      return (
        <img
          src={url}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        />
      );
    }
    // fallback initials from email
    const initials = email ? email.charAt(0).toUpperCase() : "U";
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-black font-semibold">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          {/* Header container */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
            {/* Left: Sidebar Icon + Logo */}
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

              {/* Suggestions Dropdown */}
              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full max-w-full bg-card z-50 rounded-md overflow-hidden shadow-lg">
                  {isLoading ? (
                    <Loader />
                  ) : data && data?.data.length ? (
                    <>
                      {data?.data?.map((item) => (
                        <div
                          onClick={() => navigateToAnimePage(item.id)}
                          className="flex w-full justify-start items-start bg-backGround hover:bg-lightBg px-3 py-4 gap-4 cursor-pointer"
                          key={item.id}
                        >
                          <div className="poster shrink-0 relative w-10 h-14">
                            <img
                              className="h-full w-full object-cover object-center rounded-sm"
                              src={item.poster}
                              alt={item.title}
                            />
                          </div>
                          <div className="info">
                            <h4 className="title text-sm font-semibold line-clamp-2">
                              {item.title}
                            </h4>
                            <h6 className="gray text-xs line-clamp-1">
                              {item.alternativeTitle}
                            </h6>
                            <div className="flex items-center gap-2 text-xs gray">
                              <h6>{item.aired}</h6>
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              <h6>{item.type}</h6>
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              <h6>{item.duration}</h6>
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

            {/* Right side: login / avatar */}
            <div className="ml-auto flex items-center gap-3">
              {!user ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-primary px-3 py-1 rounded text-black font-semibold"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={onProfileClick}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar url={user?.user_metadata?.avatar_url || user?.avatar_url} email={user?.email} />
                  </button>

                  {openProfileMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow p-2 z-50">
                      <button
                        onClick={goToProfile}
                        className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                      >
                        Profile
                      </button>
                      <button
                        onClick={goToWatchlist}
                        className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                      >
                        Watchlist
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded text-red-600"
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
