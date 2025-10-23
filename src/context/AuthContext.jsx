import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async (user) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No profile exists yet, create empty
        await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            username: "",
            gender: "",
            avatar_url: "",
            bio: "",
          },
        ]);
        setProfile({
          id: user.id,
          email: user.email,
          username: "",
          gender: "",
          avatar_url: "",
          bio: "",
        });
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err.message);
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      fetchProfile(data.session?.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        fetchProfile(session?.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, profile, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
