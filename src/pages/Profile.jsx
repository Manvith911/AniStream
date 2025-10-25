import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { generateAnimeAvatar } from "../utils/generateAnimeAvatar";
import notify from "../utils/Toast";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    gender: "",
    bio: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load profile
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) notify("error", error.message);
      else if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerateAvatar = async () => {
    const img = await generateAnimeAvatar();
    if (img) {
      setProfile((prev) => ({ ...prev, avatar_url: img }));
      notify("info", "New anime avatar generated!");
    } else notify("error", "Failed to generate avatar.");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        gender: profile.gender,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) notify("error", "Failed to save profile.");
    else notify("success", "Profile saved successfully!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-primary text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-6 bg-backGround text-white">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl p-8 border border-gray-700/40">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          My Profile
        </h1>

        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-primary shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <img
              src={
                profile.avatar_url ||
                "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              }
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={handleGenerateAvatar}
            className="mt-4 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-80 transition-all duration-300"
          >
            🎨 Generate Anime Avatar
          </button>
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username || ""}
              onChange={handleChange}
              className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Gender</label>
            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
              className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              placeholder="Write something about yourself..."
            ></textarea>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md mt-4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
