// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user session on first render
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await ensureProfileExists(currentUser);
      }

      setLoading(false);
    };

    initAuth();

    // ✅ Real-time auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await ensureProfileExists(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ✅ Create empty profile if not exists
  const ensureProfileExists = async (user) => {
    try {
      const { data: existingProfile, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (selectError) console.error("Select profile error:", selectError.message);

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            username: user.email?.split("@")[0] || "user",
            avatar_url: "",
            gender: null,
            bio: "",
          },
        ]);

        if (insertError) {
          console.error("Insert profile error:", insertError.message);
        } else {
          toast.success("Profile created!");
        }
      }

      // ✅ Always load profile (fresh)
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    } catch (err) {
      console.error("ensureProfileExists() crashed:", err);
    }
  };

  // ✅ Auth actions
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) toast.error(error.message);
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) toast.error(error.message);
    else toast.info("Check your email to confirm your account.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
