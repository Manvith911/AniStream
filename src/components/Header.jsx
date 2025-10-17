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
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile on mount & on auth change
  const fetchProfile = async () => {
    setLoadingProfile(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);
    } else {
      setProfile(null);
    }
    setLoadingProfile(false);
  };

  useEffect(() => {
    fetchProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => fetchProfile());
    return () => listener.subscription.unsubscribe();
  }, []);

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

  const goToLogin = () => navigate("/auth");

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null); // Clear profile immediately
  };

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

            {/* Middle: Search Bar */}
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
                <div className="absolute top-full mt-1 left-0 w-full max-w-full bg-card z-50 rounded-md overflow-hidden shadow-lg">
                  {isLoading ? (
                    <Loader />
                  ) : data && data?.data.length ? (
                    <>
                      {data.data.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigateToAnimePage(item.id)}
                          className="flex w-full justify-start items-start bg-backGround hover:bg-lightBg px-3 py-4 gap-4 cursor-pointer"
                        >
                          <div className="poster shrink-0 relative w-10 h-14">
                            <img
                              src={item.poster}
                              alt={item.title}
                              className="h-full w-full object-cover object-center rounded-sm"
                            />
                          </div>
                          <div className="info">
                            <h4 className="title text-sm font-semibold line-clamp-2">{item.title}</h4>
                            <h6 className="gray text-xs line-clamp-1">{item.alternativeTitle}</h6>
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
                    <h1 className="text-center text-sm text-primary py-3">Anime not found :(</h1>
                  )}
                </div>
              )}
            </div>

            {/* Right: Login/Profile */}
            <div className="flex justify-end sm:ml-4">
              {!loadingProfile && profile ? (
                <div className="flex items-center gap-2">
                  <img
                    src={profile.avatar_url || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{profile.username || profile.email}</span>
                  <button
                    onClick={logout}
                    className="ml-2 px-2 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={goToLogin}
                  className="bg-primary text-black px-4 py-1 rounded-md text-sm font-semibold hover:bg-yellow-400 transition"
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
