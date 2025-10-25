import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load session on mount
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

    // ✅ Listen for auth state changes (login / logout / signup)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await ensureProfileExists(currentUser);
        navigate("/home"); // ✅ Redirect to home after login/signup
      } else {
        setProfile(null);
        navigate("/auth"); // ✅ Redirect to auth after logout
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // ✅ Create profile if not exists
  const ensureProfileExists = async (user) => {
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

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

      // ✅ Load fresh profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) console.error("Load profile error:", error.message);
      else setProfile(data);
    } catch (err) {
      console.error("ensureProfileExists crashed:", err);
    }
  };

  // ✅ Sign up (sends confirmation email)
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

  // ✅ Sign in
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (!data.session) {
        toast.info("Please verify your email before logging in.");
        return;
      }

      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("Something went wrong during login.");
    }
  };

  // ✅ Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate("/auth");
    toast.info("Logged out successfully.");
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
