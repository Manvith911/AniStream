import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const genderOptions = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

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
      const { data: { user } } = await supabase.auth.getUser();
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
    const { data: { user } } = await supabase.auth.getUser();
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {!editing ? (
        <>
          <p><strong>Username:</strong> {profile?.username || "N/A"}</p>
          <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
          <p><strong>Gender:</strong> {profile?.gender || "N/A"}</p>
          <p><strong>Bio:</strong> {profile?.bio || "No bio yet"}</p>

          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-black rounded"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <input
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Username"
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />

          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            placeholder="Bio"
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-500 text-black rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
