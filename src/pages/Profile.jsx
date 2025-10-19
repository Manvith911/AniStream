import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/Auth";
import { supabase } from "../services/supabaseClient";
import Logo from "../components/Logo";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, profile, error } = await getCurrentUser();
      if (error) {
        setMessage("Error fetching profile");
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
    await logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({
        username: userData.username,
        gender: userData.gender,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        updated_at: new Date(),
      })
      .eq("id", userData.id);
    setSaving(false);
    if (error) {
      console.error(error);
      setMessage("Failed to update profile 😞");
    } else {
      setMessage("Profile updated successfully 🎉");
      setEditMode(false);
    }
  };

  const randomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    const newAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
    setUserData((prev) => ({ ...prev, avatar_url: newAvatar }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-20 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 opacity-20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-2xl bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-700 p-8 mt-16">
        <div className="flex items-center justify-center mb-6">
          <Logo />
        </div>

        {/* Profile section */}
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
            {editMode ? (
              <>
                <input
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className="w-full bg-[#FBF8EF] text-black px-3 py-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Username"
                />
                <select
                  name="gender"
                  value={userData.gender || ""}
                  onChange={handleChange}
                  className="w-full bg-[#FBF8EF] text-black px-3 py-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  name="bio"
                  value={userData.bio || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-[#FBF8EF] text-black px-3 py-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Write your bio..."
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={randomizeAvatar}
                    className="px-4 py-1 text-xs rounded-md bg-primary text-black font-semibold hover:bg-yellow-400 transition-all"
                  >
                    Random Avatar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-6 py-1 text-sm rounded-md font-semibold transition-all ${
                      saving
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-primary text-black hover:bg-yellow-400"
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-1 text-sm rounded-md border border-gray-400 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-primary mb-1">
                  {userData.username}
                </h2>
                <p className="text-gray-300 mb-2">{userData.email}</p>
                <p className="text-gray-400 text-sm mb-2 capitalize">
                  {userData.gender || "Not specified"}
                </p>
                <p className="text-gray-400 text-sm italic mb-3">
                  {userData.bio || "No bio available"}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 rounded-md bg-primary text-black font-semibold hover:bg-yellow-400 transition-all"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 mt-8">
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-md bg-transparent border border-primary text-primary font-semibold hover:bg-primary hover:text-black transition-all"
          >
            Logout
          </button>
        </div>

        {message && (
          <p
            className={`text-center mt-5 text-sm font-semibold ${
              message.includes("successfully") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
