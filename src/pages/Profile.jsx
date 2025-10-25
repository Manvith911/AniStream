// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { generateAnimeAvatar } from "../utils/generateAnimeAvatar";

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

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) console.error(error);
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
    if (img) setProfile((prev) => ({ ...prev, avatar_url: img }));
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
    if (error) alert("Failed to save profile");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* Profile Avatar */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-md">
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
        className="mt-3 px-4 py-2 bg-primary text-black rounded-lg hover:opacity-80"
      >
        🎨 Generate Anime Avatar
      </button>

      {/* Editable Fields */}
      <div className="w-full max-w-md mt-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Gender</label>
          <select
            name="gender"
            value={profile.gender || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 bg-gray-50"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded px-3 py-2 bg-gray-50"
            placeholder="Write something about yourself..."
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-80"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
