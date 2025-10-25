import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import notify from "../utils/Toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ensureProfile = async (sbUser) => {
    if (!sbUser) return;
    try {
      await supabase.from("profiles").upsert(
        {
          id: sbUser.id,
          email: sbUser.email,
          username: sbUser.user_metadata?.full_name || sbUser.email.split("@")[0],
          avatar_url: sbUser.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
        },
        { returning: "minimal" }
      );
    } catch (err) {
      console.error("ensureProfile error:", err);
    }
  };

  const signUp = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data?.user) await ensureProfile(data.user);
      notify("success", "Sign up successful! Please confirm your email.");
      return { data, error: null };
    } catch (error) {
      notify("error", error.message || "Sign up failed");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) await ensureProfile(data.user);
      setUser(data.user);
      notify("success", "Logged in successfully!");
      navigate("/home");
      return { data, error: null };
    } catch (error) {
      notify("error", error.message || "Sign in failed");
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      notify("success", "Logged out successfully!");
      navigate("/");
    } catch (err) {
      notify("error", err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) await ensureProfile(currentSession.user);
        }
      } catch (err) {
        console.error("auth init error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, sessionObj) => {
        const sbUser = sessionObj?.user ?? null;
        if (sbUser) await ensureProfile(sbUser);
        setUser(sbUser);
        setSession(sessionObj ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
