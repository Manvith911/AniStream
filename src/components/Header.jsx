import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

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

  // --- Supabase Auth Handlers ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMessage("");

    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthMessage("✅ Signed in successfully!");
        setTimeout(() => setIsAuthModalOpen(false), 1200);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthMessage("✅ Account created! Please verify your email.");
      }
    } catch (err) {
      setAuthMessage(`❌ ${err.message}`);
    }
  };

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

            {/* Search Bar */}
            <div className="relative w-full sm:max-w-[400px] flex-1">
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

            {/* Right: Login Button */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-black font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Auth Modal --- */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex justify-center items-center">
          <div className="bg-[#1a1a1f] p-6 rounded-lg w-[90%] max-w-md shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setIsAuthModalOpen(false)}
            >
              <FaXmark size={20} />
            </button>

            <h2 className="text-white text-lg font-bold mb-4 text-center">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </h2>

            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 rounded bg-[#2a2a2f] text-white focus:outline-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 rounded bg-[#2a2a2f] text-white focus:outline-primary"
              />
              <button
                type="submit"
                className="bg-primary text-black py-2 rounded-md font-semibold"
              >
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {authMessage && (
              <p className="text-sm text-center mt-3 text-gray-300">{authMessage}</p>
            )}

            <p className="text-sm text-gray-400 text-center mt-3">
              {authMode === "signin" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-primary font-semibold"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-primary font-semibold"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
