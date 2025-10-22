import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Fetch the profile ----
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        console.log("Profile missing, creating one...");
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId }])
          .select()
          .single();
        if (insertError) console.error(insertError.message);
        else setProfile(newProfile);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  // ---- Initialize Session ----
  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error.message);
      const currentSession = data?.session ?? null;
      setSession(currentSession);
      if (currentSession?.user) await fetchProfile(currentSession.user.id);
      setLoading(false);
    };

    getInitialSession();

    // ---- Auth listener ----
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state:", event, session);
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---- Logout ----
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    setSession(null);
    setProfile(null);
    window.location.replace("/auth"); // force reload
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
