import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

const ProfilePage = () => {
  const { profile } = useAuth();
  const [form, setForm] = useState({
    username: profile?.username || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
    avatar_url: profile?.avatar_url || "",
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.username,
        bio: form.bio,
        gender: form.gender,
        avatar_url: form.avatar_url,
      })
      .eq("id", profile.id);

    setLoading(false);
    if (error) alert(error.message);
    else alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-white">
      <form
        onSubmit={handleUpdate}
        className="bg-[#1a1a1f] p-8 rounded-xl shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 bg-[#222] rounded focus:outline-none"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="text"
          placeholder="Avatar URL"
          className="w-full p-2 mb-3 bg-[#222] rounded focus:outline-none"
          value={form.avatar_url}
          onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
        />

        <input
          type="text"
          placeholder="Gender"
          className="w-full p-2 mb-3 bg-[#222] rounded focus:outline-none"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />

        <textarea
          placeholder="Bio"
          className="w-full p-2 mb-4 bg-[#222] rounded focus:outline-none"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black font-semibold py-2 rounded hover:bg-opacity-80"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
