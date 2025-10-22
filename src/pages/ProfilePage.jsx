import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { session, profile, loading } = useAuth();
  const [form, setForm] = useState({
    username: "",
    bio: "",
    gender: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!session?.user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: form.username,
        bio: form.bio,
        gender: form.gender,
        avatar_url: form.avatar_url,
      })
      .eq("id", session.user.id);

    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Loading...</p>
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>No profile found. Please log in again.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex justify-center py-20">
      <div className="bg-card p-6 rounded-xl w-full max-w-lg shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-4">My Profile</h1>

        <div className="flex flex-col items-center gap-3">
          <img
            src={
              form.avatar_url ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-primary"
          />
          <input
            name="avatar_url"
            value={form.avatar_url}
            onChange={handleChange}
            placeholder="Avatar URL"
            className="bg-gray-800 px-4 py-2 rounded-md w-full"
          />
        </div>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="bg-gray-800 px-4 py-2 rounded-md w-full"
        />
        <input
          name="gender"
          value={form.gender}
          onChange={handleChange}
          placeholder="Gender"
          className="bg-gray-800 px-4 py-2 rounded-md w-full"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="bg-gray-800 px-4 py-2 rounded-md w-full"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-black py-2 rounded-md font-bold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
