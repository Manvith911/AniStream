import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/useApi";
import Logo from "./Logo";
import useSidebarStore from "../store/sidebarStore";
import Loader from "./Loader";

// Import your favicon image
import favicon from "../assets/favicon1.png";

const Header = () => {
  const sidebarHandler = useSidebarStore((state) => state.toggleSidebar);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  const emptyInput = () => {
    setValue("");
    setDebouncedValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Modal open/close
  const toggleLoginModal = () => setIsLoginOpen((prev) => !prev);

  // Google auth handler placeholder
  const handleGoogleLogin = () => {
    alert("Google login clicked!");
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

            {/* On mobile, Login button above search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 w-full sm:w-auto">
              <button
                onClick={toggleLoginModal}
                className="mb-2 sm:mb-0 sm:order-2 bg-primary text-black font-semibold px-4 py-2 rounded hover:bg-primary-dark transition"
              >
                Login
              </button>

              {/* Search Bar */}
              <div className="relative w-full sm:ml-6 sm:max-w-[400px] sm:order-1">
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
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md relative shadow-lg">
            {/* Close Button */}
            <button
              onClick={toggleLoginModal}
              className="absolute top-4 right-4 text-white hover:text-primary transition"
              aria-label="Close login modal"
            >
              <FaXmark size={24} />
            </button>

            {/* Modal Header with favicon */}
            <div className="flex items-center gap-3 mb-6">
              <img src={favicon} alt="AnimeRealm Favicon" className="w-8 h-8" />
              <h2 className="text-2xl font-bold text-white">Welcome to AnimeRealm</h2>
            </div>

            {/* Sign In / Sign Up Buttons */}
            <div className="flex flex-col gap-4">
              <button className="bg-primary text-black py-3 rounded font-semibold hover:bg-primary-dark transition w-full">
                Sign In
              </button>

              <button
                onClick={handleGoogleLogin}
                className="bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition w-full flex items-center justify-center gap-3"
              >
                {/* Google Icon (using SVG inline for better control) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083h-1.776v-.064H24v7.832h11.034c-1.316 3.572-4.968 6.124-9.534 6.124a10.42 10.42 0 01-10.412-10.412 10.42 10.42 0 0110.412-10.412c2.607 0 4.967.995 6.69 2.612l4.76-4.76C34.5 9.084 29.57 7 24 7 12.954 7 4 15.954 4 27s8.954 20 20 20 20-8.954 20-20c0-1.344-.139-2.646-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.82A11.911 11.911 0 0012 27c0 3.042 1.164 5.8 3.042 7.86l-6.573 5.01C5.265 36.13 3 31.923 3 27c0-4.92 2.265-9.133 6.306-12.309z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.797 0 10.699-2.07 14.277-5.282l-6.565-5.012C29.75 36.008 27.03 37 24 37c-4.35 0-8.04-2.865-9.424-6.733l-6.567 5.012A19.872 19.872 0 0024 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083h-1.776v-.064H24v7.832h11.034a10.06 10.06 0 01-3.19 5.148l6.566 5.01C40.525 33.66 44 27 44 27c0-1.344-.139-2.646-.389-3.917z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
