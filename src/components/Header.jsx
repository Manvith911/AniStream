import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
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
  const { user, profile, signOut, signInWithGoogle } = useAuth();

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
    e?.preventDefault();
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

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="relative z-[100]">
      <div className="fixed bg-card w-full py-2 shadow-md">
        <div className="flex flex-col px-4 sm:px-6 md:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
            {/* Left: Sidebar + Logo */}
            <div className="flex items-center gap-3">
              <div className="cursor-pointer" onClick={sidebarHandler}>
                <FaBars size={25} />
              </div>
              <Logo />
            </div>

            {/* Search */}
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
                    onClick={() => setValue("")}
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

              {debouncedValue.length > 2 && (
                <div className="absolute top-full mt-1 left-0 w-full bg-card rounded-md shadow-lg overflow-hidden z-50">
                  {isLoading ? (
                    <Loader />
                  ) : data && data?.data?.length ? (
                    <>
                      {data?.data?.map((item) => (
                        <div
                          onClick={() => navigateToAnimePage(item.id)}
                          key={item.id}
                          className="flex w-full items-start bg-backGround hover:bg-lightBg px-3 py-4 gap-4 cursor-pointer"
                        >
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-sm"
                          />
                          <div className="info">
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
                    <h1 className="text-center text-sm text-primary py-3">
                      No results found
                    </h1>
                  )}
                </div>
              )}
            </div>

            {/* Right: User section */}
            <div className="ml-auto flex items-center gap-3">
              {!user ? (
                <button
                  onClick={signInWithGoogle}
                  className="py-1 px-3 bg-primary rounded-md text-black"
                >
                  Login with Google
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown((s) => !s)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
                    title={profile?.username || user?.email}
                  >
                    <img
                      src={
                        profile?.avatar_url ||
                        user?.user_metadata?.avatar_url ||
                        "/default-avatar.png"
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {openDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-card rounded-md shadow-lg overflow-hidden z-50">
                      <Link
                        to="/profile"
                        onClick={() => setOpenDropdown(false)}
                        className="block px-4 py-2 hover:bg-backGround"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/watchlist"
                        onClick={() => setOpenDropdown(false)}
                        className="block px-4 py-2 hover:bg-backGround"
                      >
                        Watchlist
                      </Link>
                      <button
                        onClick={() => {
                          setOpenDropdown(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-backGround"
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
