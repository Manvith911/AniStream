import { useRef, useState } from "react";
import { FaArrowCircleRight, FaBars, FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
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

  const [modalOpen, setModalOpen] = useState(false);

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

  const toggleModal = () => setModalOpen((prev) => !prev);

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

            {/* Login Button */}
            <div>
              <button
                onClick={toggleModal}
                className="bg-primary text-black px-4 py-1 rounded-md font-semibold hover:bg-primary-dark transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <FaXmark size={24} />
            </button>

            {/* Favicon Style Welcome */}
            <div className="flex items-center justify-center mb-6 gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-extrabold text-lg select-none">
                AR
              </div>
              <h2 className="text-2xl font-bold text-center">Welcome to AnimeRealm</h2>
            </div>

            {/* Google Continue Button */}
            <button
              onClick={() => alert("Continue with Google clicked!")}
              className="flex items-center justify-center gap-3 w-full py-2 mb-4 rounded-md border border-gray-600 hover:bg-gray-700 transition text-white"
            >
              <FcGoogle size={24} />
              <span className="font-semibold">Continue with Google</span>
            </button>

            {/* Simple Tabs */}
            <Tabs />
          </div>
        </div>
      )}
    </div>
  );
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("signIn");

  return (
    <div>
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab("signIn")}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === "signIn"
              ? "bg-primary text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab("signUp")}
          className={`px-4 py-2 rounded-md font-semibold ${
            activeTab === "signUp"
              ? "bg-primary text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {activeTab === "signIn" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
};

const SignInForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sign In submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-md border border-gray-600 px-3 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-md border border-gray-600 px-3 py-2 text-black"
      />
      <button
        type="submit"
        className="w-full bg-primary text-black py-2 rounded-md font-semibold hover:bg-primary-dark transition"
      >
        Sign In
      </button>
    </form>
  );
};

const SignUpForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sign Up submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        required
        className="w-full rounded-md border border-gray-600 px-3 py-2 text-black"
      />
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full rounded-md border border-gray-600 px-3 py-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full rounded-md border border-gray-600 px-3 py-2 text-black"
      />
      <button
        type="submit"
        className="w-full bg-primary text-black py-2 rounded-md font-semibold hover:bg-primary-dark transition"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Header;
