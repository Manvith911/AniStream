import { useRef, useState, useEffect } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";
import { supabase } from "../services/supabaseClient";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // --- Debounced Search ---
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

  // --- Auth State Handling ---
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Fetch user profile ---
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    if (error) console.error(error);
    else setProfile(data);
  };

  // --- Logout ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setDropdownOpen(false);
    navigate("/home");
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // --- Hide dropdown when clicking outside ---
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left: Sidebar + Logo */}
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

              {/* Suggestions */}
              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-card rounded-md overflow-hidden shadow-lg z-50">
                  {isLoading ? (
                    <Loader />
                  ) : data?.data?.length ? (
                    <>
                      {data.data.map((item) => (
                        <div
                          onClick={() => navigateToAnimePage(item.id)}
                          key={item.id}
                          className="flex items-start bg-backGround hover:bg-lightBg px-3 py-3 gap-4 cursor-pointer"
                        >
                          <img
                            className="h-14 w-10 object-cover rounded-sm"
                            src={item.poster}
                            alt={item.title}
                          />
                          <div className="info">
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-400">{item.type}</p>
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
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right: Auth/Profile */}
            <div className="relative profile-dropdown">
              {session ? (
                <div>
                  <img
                    src={profile?.avatar_url || "/default-avatar.png"}
                    alt="profile"
                    onClick={toggleDropdown}
                    className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer object-cover"
                  />

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-card rounded-md shadow-lg border border-gray-700">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate("/watchlist");
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-lightBg"
                      >
                        Watchlist
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-lightBg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-primary px-4 py-1.5 rounded-md text-black font-semibold"
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
