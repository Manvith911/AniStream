import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { session, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");

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
        setBio(data.bio || "");
      }
    };
    fetchProfile();
  }, [session]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio, updated_at: new Date() })
        .eq("id", session.user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message);
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
          src={
            profile?.avatar_url ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border border-primary object-cover"
        />
        <h2 className="text-2xl font-bold">{profile?.username}</h2>
        <p className="text-sm text-gray-400 mb-2">{profile?.email}</p>
        <p className="text-sm text-gray-400 mb-4">{profile?.gender}</p>

        <textarea
          className="w-full bg-lightBg text-black rounded p-2"
          placeholder="Write something about yourself..."
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          onClick={updateProfile}
          disabled={loading}
          className="bg-primary text-black font-semibold py-2 px-6 rounded mt-3 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
