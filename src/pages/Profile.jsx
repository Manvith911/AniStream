import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/Auth";
import Logo from "../components/Logo";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, profile, error } = await getCurrentUser();
      if (error) {
        setErrorMsg(error);
      } else if (user && profile) {
        setUserData({ ...profile, email: user.email });
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  if (errorMsg)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-400 bg-[#0f0f0f]">
        <h2>Error loading profile</h2>
        <p className="text-sm">{errorMsg}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-20 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 opacity-20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-2xl bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-700 p-8 mt-16">
        <div className="flex items-center justify-center mb-6">
          <Logo />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-primary shadow-lg">
            <img
              src={
                userData?.avatar_url ||
                `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userData?.username || "User"}`
              }
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-primary mb-1">
              {userData?.username}
            </h2>
            <p className="text-gray-300 mb-2">{userData?.email}</p>
            <p className="text-gray-400 text-sm mb-2 capitalize">
              {userData?.gender || "Not specified"}
            </p>
            <p className="text-gray-400 text-sm italic">
              {userData?.bio || "No bio available"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 mt-8">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 rounded-md bg-primary text-black font-semibold hover:bg-yellow-400 transition-all"
          >
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-md bg-transparent border border-primary text-primary font-semibold hover:bg-primary hover:text-black transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
