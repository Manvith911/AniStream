import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useApi } from "../services/useApi";

const ProfilePage = () => {
  const { session, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [avatarQuery, setAvatarQuery] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState(profile?.avatar_url || "");

  // Use useApi to fetch characters
  const { data: characterData, isLoading } = useApi(
    avatarQuery.length > 2 ? `/characters?search=${avatarQuery}` : null
  );

  // Fetch profile from Supabase
  useEffect(() => {
    if (!session) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) {
        toast.error("Failed to fetch profile");
      } else {
        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setGender(data.gender || "");
        setAvatarUrl(data.avatar_url || "");
        setGeneratedAvatar(data.avatar_url || "");
      }
    };
    fetchProfile();
  }, [session]);

  // Update profile in Supabase
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
            avatar_url: generatedAvatar,
            updated_at: new Date(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;
      toast.success("Profile updated!");
      setProfile({ ...profile, username, bio, gender, avatar_url: generatedAvatar });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate random main character
  const generateRandomAvatar = async () => {
    setLoading(true);
    try {
      // Fetch random character (replace with your actual /random-character API endpoint)
      const res = await fetch(`/random-character`);
      const json = await res.json();
      if (json?.data?.length) {
        const randomChar = json.data[Math.floor(Math.random() * json.data.length)];
        setGeneratedAvatar(randomChar.image_url);
        toast.success(`Avatar set as ${randomChar.name}`);
      } else {
        toast.error("Failed to fetch character");
      }
    } catch (err) {
      toast.error("Failed to generate avatar");
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
        <img
          src={generatedAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-2 border border-primary object-cover"
        />

        <button
          onClick={generateRandomAvatar}
          disabled={loading}
          className="bg-primary text-black font-semibold py-1 px-4 rounded mb-4 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Avatar"}
        </button>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-lightBg text-black rounded p-2 mb-2"
        />

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

        <textarea
          className="w-full bg-lightBg text-black rounded p-2 mb-2"
          placeholder="Write something about yourself..."
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          onClick={updateProfile}
          disabled={loading}
          className="bg-primary text-black font-semibold py-2 px-6 rounded mt-2 hover:opacity-90 disabled:opacity-50 w-full"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Character Search for Avatar */}
        <input
          type="text"
          placeholder="Search main character for avatar"
          value={avatarQuery}
          onChange={(e) => setAvatarQuery(e.target.value)}
          className="w-full bg-lightBg text-black rounded p-2 mt-3"
        />
        {isLoading && <p className="text-sm text-gray-400">Searching characters...</p>}
        {characterData?.data?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto mt-2">
            {characterData.data.map((char) => (
              <img
                key={char.id}
                src={char.image_url}
                alt={char.name}
                className="w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-primary"
                onClick={() => setGeneratedAvatar(char.image_url)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
