// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // supabase user object
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: ensure profile exists (insert or upsert)
  const ensureProfile = async (sbUser) => {
    if (!sbUser) return;
    try {
      // upsert ensures a row exists for new users
      await supabase.from("profiles").upsert(
        {
          id: sbUser.id,
          email: sbUser.email,
          created_at: new Date().toISOString(),
        },
        { returning: "minimal" } // smaller response
      );
    } catch (err) {
      console.error("ensureProfile error:", err);
    }
  };

  // Sign up (send confirmation email automatically handled by Supabase)
  const signUp = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // If user object is returned immediately, create profile row
      const sbUser = data?.user ?? null;
      if (sbUser) await ensureProfile(sbUser);
      // If email confirmation is enabled, user will need to confirm via email
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email & password
  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // ensure profile exists
      const sbUser = data?.user ?? null;
      if (sbUser) await ensureProfile(sbUser);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/"); // optional: redirect home
    } catch (err) {
      console.error("Sign out error", err);
    } finally {
      setLoading(false);
    }
  };

  // On mount: get current session/user and subscribe to auth changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const {
          data: { user: currentUser, session: currentSession },
        } = await supabase.auth.getUser()
          .then(async (res) => {
            // supabase.auth.getUser returns { data: { user } } in v2; falling back:
            return { data: { user: res.data?.user ?? null } };
          })
          .catch(() => ({ data: { user: null } }));

        // Better approach using getSession to fetch session + user
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setSession(data?.session ?? null);
            setUser(data?.session?.user ?? currentUser ?? null);
            if (data?.session?.user) await ensureProfile(data.session.user);
          }
        } catch {
          // fallback: set user if available
          if (mounted) {
            setUser(currentUser);
            if (currentUser) await ensureProfile(currentUser);
          }
        }
      } catch (err) {
        console.error("auth init error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, sessionObj) => {
        // event examples: "SIGNED_IN", "SIGNED_OUT", "PASSWORD_RECOVERY", etc.
        const sbUser = sessionObj?.user ?? null;
        if (sbUser) await ensureProfile(sbUser);
        setUser(sbUser);
        setSession(sessionObj ?? null);
      }
    );

    return () => {
      mounted = false;
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
