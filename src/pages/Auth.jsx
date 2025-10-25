// src/pages/Auth.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (mode === "signup") {
      const { error } = await signUp({ email, password });
      if (error) setMsg(error.message);
      else setMsg("Check your email for a confirmation link.");
    } else {
      const { error } = await signIn({ email, password });
      if (error) setMsg(error.message);
      else navigate("/home");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="bg-white p-6 rounded-lg shadow w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === "signup" ? "Create Account" : "Sign In"}
        </h2>
        {msg && <p className="text-sm text-center text-red-600 mb-2">{msg}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-primary text-black py-2 rounded">
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center mt-3">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-primary font-semibold"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-primary font-semibold"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
