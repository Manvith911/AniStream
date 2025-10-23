import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    gender: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);
        setFormData({
          username: data?.username || "",
          bio: data?.bio || "",
          gender: data?.gender || "",
        });
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  const handleUpdate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.username,
        bio: formData.bio,
        gender: formData.gender,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    if (!error) {
      alert("Profile updated!");
      setEditing(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="pt-24 px-8 max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 transition-all">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        My Profile
      </h2>

      {!editing ? (
        <div className="space-y-5 text-gray-700 dark:text-gray-300">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium text-lg">{profile?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-lg">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-lg">{profile?.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bio</p>
            <p className="font-medium">{profile?.bio || "No bio yet."}</p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Username
            </label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Gender
            </label>
            <input
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              placeholder="Gender"
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
