// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Sync state with profile data from context
  useEffect(() => {
    setUsername(profile?.username || "");
    setGender(profile?.gender || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateProfile({
      username: username || null,
      gender: gender || null,
      bio: bio || null,
    });
    setSaving(false);
    if (error) {
      console.error(error);
      toast.error("Failed to save profile.");
    } else {
      toast.success("Profile saved successfully!");
      await refreshProfile(); // ✅ ensures new data is reflected in UI
    }
  };

  // Fetch random character image from AniList API
  const generateRandomImage = async () => {
    setGenerating(true);
    try {
      const fetchCharacterById = async (id) => {
        const query = `
          query ($id: Int) {
            Character(id: $id) {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        `;
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { id } }),
        });
        return res.json();
      };

      // Try up to 6 random character IDs
      let found = null;
      for (let i = 0; i < 6; i++) {
        const randomId = Math.floor(Math.random() * 200000) + 1;
        // eslint-disable-next-line no-await-in-loop
        const result = await fetchCharacterById(randomId);
        const char = result?.data?.Character;
        if (char?.image?.large) {
          found = char;
          break;
        }
      }

      if (!found) {
        toast.error("Couldn't fetch a random character image. Try again.");
        return;
      }

      const avatarUrl = found.image.large;
      const { error } = await updateProfile({ avatar_url: avatarUrl });
      if (error) {
        console.error(error);
        toast.error("Failed to update avatar.");
      } else {
        toast.success(`Generated new avatar: ${found.name.full}`);
        await refreshProfile(); // ✅ Refresh immediately
      }
    } catch (err) {
      console.error("generateRandomImage error:", err);
      toast.error("Error generating image.");
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card rounded-md p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={profile?.avatar_url || "/default-avatar.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={generateRandomImage}
              className="py-2 px-4 bg-primary rounded-md text-black font-medium"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Image"}
            </button>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 w-full">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-primary">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-backGround border border-primary/30 focus:border-primary focus:outline-none"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-primary">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-backGround border border-primary/30 focus:border-primary focus:outline-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-primary">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-backGround border border-primary/30 focus:border-primary focus:outline-none"
                placeholder="Tell the world about yourself..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="py-2 px-4 bg-primary text-black rounded-md font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p>
            Email: <strong>{profile?.email || user?.email}</strong>
          </p>
          <p>Profile ID: {user?.id}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
