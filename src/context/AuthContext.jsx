// src/context/AuthContext.jsx
import React, { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    loadSession();

    // Listen for auth state changes (sign in / sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from Supabase
  const fetchProfile = async (id) => {
    if (!id) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading profile:", error);
    } else {
      setProfile(data);
    }
  };

  // Refresh profile after update or avatar change
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Update profile data
  const updateProfile = async (updates) => {
    if (!user) return { error: new Error("No user logged in") };
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date() })
      .eq("id", user.id);
    if (!error) await refreshProfile();
    return { error };
  };

  // Sign in
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
    return { data, error };
  };

  // Sign up
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error && data?.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          email,
          username: "",
          gender: "",
          bio: "",
          avatar_url: null,
        },
      ]);
      await fetchProfile(data.user.id);
    }
    return { data, error };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
