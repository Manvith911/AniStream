import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

const ANILIST_API = "https://graphql.anilist.co";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) console.error("Fetch profile error:", error);
      else if (data) {
        setProfile(data);
        setUsername(data.username || "");
        setGender(data.gender || "");
        setBio(data.bio || "");
        setGeneratedAvatar(data.generated_avatar || "");
        setPreviewAvatar(data.generated_avatar || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  // Generate a random main character avatar from AniList
  const generateAvatar = async () => {
    try {
      const query = `
        query ($perPage: Int) {
          Page(perPage: $perPage) {
            characters(sort: FAVOURITES_DESC, perPage: $perPage) {
              nodes {
                name { full }
                image { large }
              }
            }
          }
        }`;
      const variables = { perPage: 50 };
      const res = await fetch(ANILIST_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      const json = await res.json();
      const characters = json.data.Page.characters.nodes;
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      setPreviewAvatar(randomChar.image.large);
    } catch (err) {
      console.error("Avatar generation error:", err);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          gender,
          bio,
          generated_avatar: previewAvatar, // save selected/generated avatar
        })
        .eq("id", user.id);

      if (error) console.error("Update error:", error);
      else {
        setGeneratedAvatar(previewAvatar);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return <div className="p-8">Please login to see profile.</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6 gap-4">
        <img
          src={
            profile?.avatar_url ||
            user.user_metadata?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.user_metadata?.full_name || user.email
            )}&background=ddd&color=333`
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
        />

        {/* Live Preview of Generated Avatar */}
        {previewAvatar && (
          <img
            src={previewAvatar}
            alt="Generated Avatar Preview"
            className="w-28 h-28 rounded-full object-cover border-2 border-emerald-500"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={generateAvatar}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
          >
            Generate Character Avatar
          </button>

          <button
            onClick={() => setPreviewAvatar(generatedAvatar)}
            disabled={!generatedAvatar}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
          >
            Reset to Saved Avatar
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <button
          onClick={handleUpdate}
          className={`px-4 py-2 rounded text-white ${
            updating ? "bg-gray-400" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
