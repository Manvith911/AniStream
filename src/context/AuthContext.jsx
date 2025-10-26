import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ensureProfile = async (userObj) => {
    if (!userObj) return;
    try {
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
        const { error } = await supabase.from("profiles").insert({
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

        if (error) console.warn("Error creating profile:", error);
      }
    } catch (err) {
      console.error("ensureProfile error:", err);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!active) return;
      setSession(initialSession ?? null);
      setUser(initialSession?.user ?? null);
      setLoading(false);

      if (initialSession?.user) {
        ensureProfile(initialSession.user);
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession ?? null);
          setUser(newSession?.user ?? null);

          if (event === "SIGNED_IN" && newSession?.user) {
            await ensureProfile(newSession.user);
            navigate("/home");
          }

          if (event === "SIGNED_OUT") {
            navigate("/");
          }
        }
      );

      return () => {
        active = false;
        listener?.subscription?.unsubscribe();
      };
    })();
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) console.error("OAuth error:", error);
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
    } catch (err) {
      console.error("signOut error:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [user, session, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen text-lg font-medium">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
