import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: "",
    gender: "",
    bio: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.getUser();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    setLoading(true);
    const user = supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...profile, id: user.id });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#0f0f0f] text-white">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          name="username"
          value={profile.username}
          onChange={handleChange}
          placeholder="Username"
          className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none"
        />
        <select
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          placeholder="Bio"
          rows="3"
          className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none resize-none"
        />
        <input
          name="avatar_url"
          value={profile.avatar_url || ""}
          onChange={handleChange}
          placeholder="Avatar URL"
          className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none"
        />

        <button
          onClick={saveProfile}
          disabled={loading}
          className="py-2 bg-primary text-black rounded-md font-semibold hover:bg-yellow-400 transition-all"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
