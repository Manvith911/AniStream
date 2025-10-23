import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch current user + profile
  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) console.error("Profile fetch error:", error);
    else setProfile(data);

    setLoading(false);
  };

  // Save updated profile
  const handleSave = async () => {
    if (!profile) return;
    setUpdating(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        gender: profile.gender,
        avatar_url: profile.avatar_url,
        bio: profile.bio, // ✅ include bio in updates
      })
      .eq("id", profile.id);

    setUpdating(false);
    if (error) setMessage(error.message);
    else setMessage("Profile updated successfully!");
  };

  // ✅ Fixed Anime Avatar Generator (Gender filter improved)
  const generateAnimeAvatar = async () => {
    try {
      setMessage("Generating anime avatar...");

      const randomPage = Math.floor(Math.random() * 100) + 1;

      const query = `
        query {
          Page(page: ${randomPage}, perPage: 20) {
            characters(sort: FAVOURITES_DESC) {
              id
              name { full }
              gender
              image { large }
            }
          }
        }
      `;

      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`AniList API error: ${res.status}`);

      const data = await res.json();
      const characters = data?.data?.Page?.characters || [];

      if (!characters.length) {
        setMessage("No characters found from AniList.");
        return;
      }

      console.log("AniList characters:", characters);

      // Normalize gender
      const userGender = (profile?.gender || "").toLowerCase().trim();
      let targetGender = "";
      if (userGender === "male") targetGender = "male";
      else if (userGender === "female") targetGender = "female";
      // "Other" or "Prefer not to say" → no filter

      // Filter characters by gender & image availability
      let filtered = characters.filter((char) => {
        const charGender = (char.gender || "").toLowerCase().trim();
        return char.image?.large && (!targetGender || charGender === targetGender);
      });

      // Fallback to all with images if gender filter fails
      if (!filtered.length) {
        filtered = characters.filter((char) => char.image?.large);
      }

      const chosen = filtered[Math.floor(Math.random() * filtered.length)];

      if (chosen?.image?.large) {
        setProfile((p) => ({ ...p, avatar_url: chosen.image.large }));
        setMessage(`New ${chosen.gender || ""} anime avatar generated!`);
      } else {
        setMessage("No suitable character found. Try again!");
      }
    } catch (err) {
      console.error("Error fetching avatar:", err);
      setMessage("Error fetching anime avatar!");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Your Profile</h2>

        {/* Avatar + Generator */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              profile?.avatar_url ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
          />
          <button
            onClick={generateAnimeAvatar}
            className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition"
          >
            Generate Anime Avatar
          </button>
        </div>

        {/* Profile Fields */}
        <div className="flex flex-col gap-3">
          <label className="text-sm text-gray-300">Username</label>
          <input
            type="text"
            value={profile?.username || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, username: e.target.value }))
            }
            className="p-2 rounded bg-gray-700 text-white outline-none"
          />

          <label className="text-sm text-gray-300">Gender</label>
          <select
            value={profile?.gender || "Prefer not to say"}
            onChange={(e) =>
              setProfile((p) => ({ ...p, gender: e.target.value }))
            }
            className="p-2 rounded bg-gray-700 text-white outline-none"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>

          {/* ✅ Bio Field */}
          <label className="text-sm text-gray-300">Bio</label>
          <textarea
            value={profile?.bio || ""}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell us something about yourself..."
            rows={3}
            className="p-2 rounded bg-gray-700 text-white outline-none resize-none"
          />

          <button
            onClick={handleSave}
            disabled={updating}
            className="mt-4 bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p className="text-center text-sm text-yellow-300 mt-3">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
