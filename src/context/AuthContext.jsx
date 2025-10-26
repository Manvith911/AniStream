import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Check existing session on load
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error.message);
      setUser(data?.session?.user || null);
      setLoading(false);
    };
    checkSession();

    // 2️⃣ Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // 3️⃣ Cleanup listener
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 4️⃣ Logout handler
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
