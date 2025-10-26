// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    username: "",
    gender: "",
    bio: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);

  // Load existing profile
  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || "",
        gender: profile.gender || "",
        bio: profile.bio || "",
        avatar_url:
          profile.avatar_url ||
          "https://i.ibb.co/6tZ7QvM/default-avatar.png",
      });
    }
  }, [profile]);

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Generate anime-style avatar from AniList (using their character API)
  const generateAvatar = async () => {
    setLoading(true);
    try {
      const query = `
        query {
          Page(perPage: 1, page: ${Math.floor(Math.random() * 1000)}) {
            characters {
              image {
                large
              }
            }
          }
        }
      `;

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const imageUrl =
        data?.data?.Page?.characters?.[0]?.image?.large ||
        "https://i.ibb.co/6tZ7QvM/default-avatar.png";

      setForm((prev) => ({ ...prev, avatar_url: imageUrl }));
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
    setLoading(false);
  };

  // Save updated profile info to Supabase
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.username,
        gender: form.gender,
        bio: form.bio,
        avatar_url: form.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update error:", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
    }
    setLoading(false);
  };

  if (!user)
    return (
      <div className="h-screen flex justify-center items-center text-white">
        <h2>Please log in to view your profile.</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-backGround flex flex-col items-center text-white py-10 px-4">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Your Profile</h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={form.avatar_url}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary mb-3"
          />
          <button
            onClick={generateAvatar}
            disabled={loading}
            className="bg-primary text-black px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate AniList Avatar"}
          </button>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-lightBg text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-lightBg text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-lightBg text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tell us something about yourself..."
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-black mt-6 py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
