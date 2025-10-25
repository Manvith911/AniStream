import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify"; // 👈 import directly here

const Auth = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // 🔹 SIGN UP
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: { full_name: username.trim() },
          },
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: email.trim(),
            username: username.trim() || email.split("@")[0],
          });
          if (profileError) throw profileError;
        }

        toast.success("Check your email to confirm your account!");
      } else {
        // 🔹 SIGN IN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setUser(data.user);

        // ✅ Navigate first (React-safe), toast after a small delay
        navigate("/home");
        setTimeout(() => toast.success("Logged in successfully!"), 100);
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/home` },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err?.message || "Google login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backGround px-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-xl border border-gray-700/40">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>

        <form onSubmit={handleAuth} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#1f1f1f] text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-black rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-semibold cursor-pointer hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#4285F4] text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
          >
            Sign {isSignUp ? "Up" : "In"} with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
