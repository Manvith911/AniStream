import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaSyncAlt } from "react-icons/fa";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarGenerating, setAvatarGenerating] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  // 🔹 Fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Error loading profile.");
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  // 🔹 Update user profile in Supabase
  const updateProfile = async () => {
    if (!profile.username || !profile.gender) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        gender: profile.gender,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  // 🔹 Generate random avatar using AniList GraphQL
  const generateAvatar = async () => {
    try {
      setAvatarGenerating(true);

      // Pick a random AniList character ID range (1–150000)
      const randomId = Math.floor(Math.random() * 150000) + 1;

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

      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { id: randomId } }),
      });

      const result = await response.json();
      const character = result?.data?.Character;

      if (!character || !character.image?.large) {
        throw new Error("No valid character found.");
      }

      const avatarUrl = character.image.large;

      setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
      toast.success(`Generated avatar: ${character.name.full}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch avatar from AniList.");
    } finally {
      setAvatarGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-primary text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backGround flex flex-col items-center px-6 py-10">
      <div className="bg-card p-6 rounded-2xl shadow-lg w-full max-w-md">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
            />
            <button
              onClick={generateAvatar}
              disabled={avatarGenerating}
              className="absolute bottom-0 right-0 bg-primary text-black p-2 rounded-full shadow hover:scale-105 transition-transform"
            >
              <FaSyncAlt
                className={`${avatarGenerating ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <h2 className="text-xl font-semibold mt-2 text-center">
            {profile?.username || "Unnamed User"}
          </h2>
        </div>

        {/* Profile Form */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="text-sm font-semibold text-primary">
              Username
            </label>
            <input
              type="text"
              value={profile?.username || ""}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className="w-full mt-1 bg-lightBg text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your username"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold text-primary">Gender</label>
            <select
              value={profile?.gender || ""}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full mt-1 bg-lightBg text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-primary">Bio</label>
            <textarea
              value={profile?.bio || ""}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              rows="3"
              className="w-full mt-1 bg-lightBg text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tell us something about yourself..."
            />
          </div>

          {/* Save Changes */}
          <button
            onClick={updateProfile}
            disabled={saving}
            className="bg-primary text-black font-semibold w-full py-2 mt-3 rounded-md hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
