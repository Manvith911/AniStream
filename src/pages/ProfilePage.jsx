import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { session, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Fetch profile from Supabase on mount
  useEffect(() => {
    if (!session) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          toast.error("Failed to fetch profile");
        } else {
          setUsername(data?.username || "");
          setBio(data?.bio || "");
          setGender(data?.gender || "");
          setAvatarUrl(data?.avatar_url || "");
          setProfile(data || { id: session.user.id });
        }
      } catch (err) {
        toast.error("Error fetching profile");
      }
    };

    fetchProfile();
  }, [session]);

  // Update profile
  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: session.user.id,
            username,
            bio,
            gender,
            avatar_url: avatarUrl,
            updated_at: new Date(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      toast.success("Profile updated!");
      setProfile({ id: session.user.id, username, bio, gender, avatar_url: avatarUrl });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate random main character avatar from AniList GraphQL
  const generateRandomAvatar = async () => {
    setLoading(true);
    try {
      const page = Math.floor(Math.random() * 50) + 1; // random page
      const query = `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji }
              characters(sort: ROLE) {
                edges {
                  node { id name { full } image { large } }
                  role
                }
              }
            }
          }
        }
      `;
      const variables = { page, perPage: 5 };

      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();
      const allMedia = json.data.Page.media;
      const mainChars = [];

      allMedia.forEach((media) => {
        media.characters.edges.forEach((edge) => {
          if (edge.role === "MAIN" && edge.node.image?.large) {
            mainChars.push(edge.node.image.large);
          }
        });
      });

      if (mainChars.length > 0) {
        const randomAvatar = mainChars[Math.floor(Math.random() * mainChars.length)];
        setAvatarUrl(randomAvatar);
        toast.success("Random main character avatar generated!");
      } else {
        toast.error("No main character found, try again!");
      }
    } catch (err) {
      toast.error("Error generating avatar");
    } finally {
      setLoading(false);
    }
  };

  if (!session)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-backGround text-white px-4">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        {/* Avatar */}
        <img
          src={avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-2 border border-primary object-cover"
        />

        {/* Generate Random Avatar Button */}
        <button
          onClick={generateRandomAvatar}
          disabled={loading}
          className="bg-primary text-black font-semibold py-1 px-4 rounded mb-4 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Avatar"}
        </button>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-lightBg text-black rounded p-2 mb-2"
        />

        {/* Gender Dropdown */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full bg-lightBg text-black rounded p-2 mb-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Bio */}
        <textarea
          className="w-full bg-lightBg text-black rounded p-2 mb-2"
          placeholder="Write something about yourself..."
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* Update Profile Button */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className="bg-primary text-black font-semibold py-2 px-6 rounded mt-2 hover:opacity-90 disabled:opacity-50 w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
