// src/pages/Auth.jsx
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // ✅ SIGN UP FLOW
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      // After user registers → create empty profile
      if (data.user) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          username,
        });
        if (insertError) console.error("Profile insert error:", insertError);
      }

      alert("Signup successful! Please check your email to confirm your account.");
      setLoading(false);
    } else {
      // ✅ SIGN IN FLOW
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f4f4]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border rounded px-3 py-2"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-black py-2 rounded hover:opacity-80"
          >
            {loading
              ? "Loading..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-semibold underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
