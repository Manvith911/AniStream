// src/pages/Profile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  React.useEffect(() => {
    setUsername(profile?.username || "");
    setGender(profile?.gender || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      username: username || null,
      gender: gender || null,
      bio: bio || null,
    });
    setSaving(false);
    if (error) {
      alert("Failed to save. See console.");
    } else {
      alert("Saved");
    }
  };

  // Fetch random character image from AniList (GraphQL)
  const generateRandomImage = async () => {
    setGenerating(true);
    try {
      // We'll attempt a few times picking a random id
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
                medium
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

      // try up to 6 attempts with random ids
      const maxAttempts = 6;
      let found = null;
      for (let i = 0; i < maxAttempts; i++) {
        // AniList character ids currently are usually under ~200k; pick a random range
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
        alert("Couldn't fetch a random character image. Try again.");
        setGenerating(false);
        return;
      }

      // update avatar_url in profiles table through updateProfile helper
      const avatarUrl = found.image.large;
      const { error } = await updateProfile({ avatar_url: avatarUrl });
      if (error) {
        alert("Failed to update avatar in database.");
        console.error(error);
      } else {
        alert(`Generated avatar: ${found.name.full}`);
      }
    } catch (err) {
      console.error("generateRandomImage err:", err);
      alert("Error generating image. See console.");
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card rounded-md p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
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
              className="py-2 px-4 bg-primary rounded-md text-black"
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Image"}
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-backGround border"
                placeholder="Choose a username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={gender || ""}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-backGround border"
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
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={bio || ""}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-backGround border"
                placeholder="Tell the world about yourself..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="py-2 px-4 bg-primary text-black rounded-md"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted">
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
