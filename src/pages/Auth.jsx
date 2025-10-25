// src/pages/Auth.jsx
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // ✅ Email sign in / sign up
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/home` },
        });

        if (error) throw error;

        // create empty profile
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email,
            username,
          });
        }

        alert("Check your email to confirm your account!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/home");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0c10] text-white">
      <div className="bg-[#1f1f1f] p-8 rounded-2xl shadow-lg w-[90%] max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-[#121212] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#121212] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#121212] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-black py-2 rounded-lg font-semibold hover:opacity-80 transition duration-300"
          >
            {loading
              ? "Loading..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <p className="px-3 text-sm text-gray-400">or</p>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-[#202020] hover:bg-[#2a2a2a] text-white font-semibold py-2 rounded-lg border border-gray-700 transition duration-300"
        >
          <FaGoogle className="mr-2 text-red-500" /> Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-gray-400">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
