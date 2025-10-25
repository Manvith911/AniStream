// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        await loadProfile(sessionUser.id);
      }
      setLoading(false);
    };
    fetchSession();

    // ✅ Listen to auth state changes (login / logout / signup)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await ensureProfileExists(currentUser);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ✅ Load profile for user
  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading profile:", error.message);
    } else {
      setProfile(data);
    }
  };

  // ✅ Ensure profile exists for new user
  const ensureProfileExists = async (user) => {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          username: user.email?.split("@")[0],
          avatar_url: "",
          gender: null,
          bio: "",
        },
      ]);

      if (error) {
        console.error("Error creating profile:", error.message);
        toast.error("Failed to create profile.");
      } else {
        toast.success("Profile created successfully!");
        await loadProfile(user.id);
      }
    } else {
      await loadProfile(user.id);
    }
  };

  // ✅ Sign in
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
  };

  // ✅ Sign up
  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.info("Check your email to confirm your account.");
    }
  };

  // ✅ Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
