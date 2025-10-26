import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.error("fetch profile error:", error);
      } else {
        setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div>
        <p>Email: {profile?.email ?? user.email}</p>
        <p>Username: {profile?.username ?? "—"}</p>
        <p>Bio: {profile?.bio ?? "—"}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
