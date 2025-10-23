import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { session, profile, setProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    gender: "",
    avatar_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Upload Avatar
  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Avatar uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload avatar.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Generate avatar from AniList
  const generateAvatar = async () => {
    try {
      setGenerating(true);
      const query = `
        query ($perPage: Int) {
          Page(page: 1, perPage: $perPage) {
            characters(sort: FAVOURITES_DESC) {
              image {
                large
              }
            }
          }
        }
      `;
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { perPage: 1 } }),
      });

      const result = await res.json();
      const imageUrl =
        result?.data?.Page?.characters?.[0]?.image?.large || null;

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
        toast.success("Generated avatar from AniList!");
      } else {
        toast.error("Failed to generate avatar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("AniList avatar generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  // ✅ Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          bio: formData.bio,
          gender: formData.gender,
          avatar_url: formData.avatar_url,
          updated_at: new Date(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, ...formData }));
      toast.success("Profile updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

  if (!session)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <h2 className="text-xl">Please log in to view your profile.</h2>
      </div>
    );

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-backGround text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Your Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <img
            src={
              formData.avatar_url ||
              "https://i.pinimg.com/736x/8c/2b/20/8c2b2094a8d48d5a63f468ba83d95a09.jpg"
            }
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <label
            htmlFor="avatar"
            className="text-sm cursor-pointer bg-primary text-black px-3 py-1 rounded-md"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={generateAvatar}
            disabled={generating}
            className="text-sm bg-lightBg px-3 py-1 rounded-md hover:bg-primary/70"
          >
            {generating ? "Generating..." : "Generate Avatar from AniList"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-3 mt-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            className="p-2 rounded bg-lightBg text-black focus:outline-none"
            required
          />
          <textarea
            name="bio"
            value={formData.bio}
            placeholder="Your bio"
            onChange={handleChange}
            className="p-2 rounded bg-lightBg text-black focus:outline-none"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-2 rounded bg-lightBg text-black focus:outline-none"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="bg-primary text-black font-semibold py-2 rounded-md hover:bg-primary/70"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
