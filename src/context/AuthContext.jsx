// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null); // auth user
  const [profile, setProfile] = useState(null); // profiles table row
  const [loading, setLoading] = useState(true);

  // Insert/upsert profile row when a new user signs in
  const upsertProfile = async (user) => {
    if (!user) return;

    const { id, email, user_metadata } = user;

    // pick avatar from provider metadata if exists
    const avatar = user_metadata?.avatar_url || user_metadata?.picture || null;

    const payload = {
      id,
      email: email ?? null,
      avatar_url: avatar,
      username: null,
      gender: null,
      bio: null,
    };

    // use upsert to create if not exist
    const { error } = await supabase.from("profiles").upsert(payload, {
      onConflict: "id",
    });

    if (error) {
      console.error("Error upserting profile:", error);
    } else {
      await fetchProfile(id);
    }
  };

  const fetchProfile = async (uid) => {
    if (!uid) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();

    if (error) {
      console.warn("No profile found:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession ?? null);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await upsertProfile(currentSession.user);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await upsertProfile(currentSession.user);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only fetch profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // redirectTo: window.location.origin + "/",
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("signInWithGoogle:", err);
      throw err;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("signOut error", error);
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (patch) => {
    // patch is an object with fields to update in profiles table
    if (!user) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("profiles")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      console.error("updateProfile error", error);
      return { error };
    }
    await refreshProfile();
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
