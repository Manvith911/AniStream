import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
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
      alert("Failed to save profile");
    } else {
      alert("Profile saved!");
      await refreshProfile();
    }
  };

  const generateRandomImage = async () => {
    setGenerating(true);
    try {
      const query = `
        query ($id: Int) {
          Character(id: $id) {
            name { full }
            image { large }
          }
        }
      `;
      const fetchCharacter = async (id) => {
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { id } }),
        });
        return res.json();
      };

      let found = null;
      for (let i = 0; i < 5; i++) {
        const randomId = Math.floor(Math.random() * 200000) + 1;
        // eslint-disable-next-line no-await-in-loop
        const result = await fetchCharacter(randomId);
        const char = result?.data?.Character;
        if (char?.image?.large) {
          found = char;
          break;
        }
      }

      if (!found) {
        alert("Failed to fetch random avatar.");
        return;
      }

      const { error } = await updateProfile({ avatar_url: found.image.large });
      if (error) alert("Failed to update avatar");
      else alert(`New avatar: ${found.name.full}`);

      await refreshProfile();
    } catch (err) {
      console.error("Avatar generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card rounded-md p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar */}
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
              {generating ? "Generating..." : "Generate Avatar"}
            </button>
          </div>

          {/* Profile Fields */}
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-backGround border"
                placeholder="Your username"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={gender}
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-backGround border"
                placeholder="Write something about yourself..."
              />
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="py-2 px-4 bg-primary text-black rounded-md"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-muted">
          <p>Email: <strong>{profile?.email || user?.email}</strong></p>
          <p>User ID: {user?.id}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
