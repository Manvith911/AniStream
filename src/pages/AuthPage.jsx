// src/pages/AuthPage.jsx
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/"); // Redirect if already logged in
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) console.error("Login Error:", error.message);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-backGround text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to AnimeVerse</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-primary text-black font-semibold py-2 px-6 rounded-full hover:opacity-90"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default AuthPage;
