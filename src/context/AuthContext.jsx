import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Ensure profile exists after signup/login
  const ensureProfileExists = async (user) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      await supabase.from("profiles").insert([{ id: user.id, email: user.email }]);
    } else if (data) {
      setProfile(data);
    }
  };

  // ✅ Sign up
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Signup successful! Please check your email to confirm.");
    } catch (error) {
      toast.error(error.message);
    }
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

      await ensureProfileExists(data.user);
      setSession(data.session);
      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("Something went wrong while logging in.");
    }
  };

  // ✅ Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    toast.info("Logged out");
    navigate("/auth");
  };

  // ✅ Watch for auth state changes
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        await ensureProfileExists(data.session.user);
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) await ensureProfileExists(session.user);
        else setProfile(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
