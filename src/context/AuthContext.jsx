// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure profile exists (create empty row on first sign-in)
  const ensureProfile = async (userObj) => {
    if (!userObj) return;
    try {
      // Check if a profile exists
      const { data: existing, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userObj.id)
        .maybeSingle();

      if (selectError) {
        console.error("Error checking profile:", selectError);
        return;
      }

      if (!existing) {
        // create a new profile row. Since auth.uid() will equal user.id on client,
        // RLS insert will be allowed.
        const { data, error } = await supabase.from("profiles").insert({
          id: userObj.id,
          email: userObj.email,
          username:
            userObj.user_metadata?.full_name?.replace(/\s+/g, "_").toLowerCase() ||
            userObj.email?.split("@")[0],
          avatar_url:
            userObj.user_metadata?.avatar_url ||
            userObj.user_metadata?.picture ||
            null,
        });

        if (error) {
          // if unique violated or other race, log but continue
          console.warn("Error creating profile:", error);
        } else {
          // created
        }
      }
    } catch (err) {
      console.error("ensureProfile error:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      // initial session fetch
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(initialSession ?? null);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      if (initialSession?.user) {
        ensureProfile(initialSession.user);
      }

      // subscribe to auth changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession ?? null);
          setUser(newSession?.user ?? null);

          if (event === "SIGNED_IN" && newSession?.user) {
            await ensureProfile(newSession.user);
            // Optionally navigate somewhere after sign-in:
            // navigate("/");
          }

          if (event === "SIGNED_OUT") {
            // navigate to homepage or auth page if you want
            // navigate("/");
          }
        }
      );

      return () => {
        mounted = false;
        listener?.subscription?.unsubscribe();
      };
    })();
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // This opens the Google OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // optional redirect
          // redirectTo: window.location.origin + "/",
        },
      });

      // For OAuth, the browser will redirect to Google's consent page.
      if (error) {
        console.error("OAuth error:", error);
      }
      // data contains the url for redirect in some flows; the actual redirect is handled by supabase-client
    } catch (err) {
      console.error("signInWithGoogle error:", err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Error signing out:", error);
      // session changes will be reflected by onAuthStateChange
    } catch (err) {
      console.error("signOut error:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
