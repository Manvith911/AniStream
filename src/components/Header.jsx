import { useRef, useState, useEffect } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";
import { supabase } from "../services/supabaseClient"; // <-- your Supabase setup file

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // --- Auth states ---
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // --- Search logic ---
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

  const emptyInput = () => {
    setValue("");
    setDebouncedValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // --- Auth Handlers ---
  const handleLogin = async () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  // --- Check Supabase session on mount ---
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Derive avatar / initials ---
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.email || "Guest"}`;

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          {/* Header container */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: Sidebar Icon + Logo */}
            <div className="flex items-center gap-3">
              <div className="cursor-pointer" onClick={sidebarHandler}>
                <FaBars size={25} />
              </div>
              <Logo />
            </div>

            {/* Center: Search Bar */}
            <div className="relative w-full sm:ml-6 sm:max-w-[400px] flex-grow">
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
                  <button onClick={emptyInput} type="reset" className="text-black">
                    <FaXmark />
                  </button>
                )}
                <button type="submit" className="text-black">
                  <FaSearch />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-card z-50 rounded-md overflow-hidden shadow-lg">
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

            {/* Right: Login/Profile Section */}
            <div className="relative flex items-center justify-end min-w-[100px]">
              {!user ? (
                <button
                  onClick={handleLogin}
                  className="bg-primary text-black font-semibold px-4 py-1 rounded-full hover:bg-yellow-400 transition-all"
                >
                  Login
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  />

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-card rounded-md shadow-lg border border-gray-700 z-50">
                      <button
                        onClick={handleViewProfile}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg text-sm"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg text-sm text-red-500"
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
