import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Toggle between Login and Signup modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  // Handle Email/Password Login or Signup
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // ---- LOGIN ----
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/home");
      } else {
        // ---- SIGN UP ----
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        setMessage(
          "Signup successful! Please check your email to confirm your account."
        );
      }
    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  // Handle Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
      // Supabase will redirect automatically after OAuth
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 rounded-xl p-8 shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded bg-gray-700 outline-none text-white placeholder-gray-400"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 outline-none text-white placeholder-gray-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 outline-none text-white placeholder-gray-400"
            required
          />

          <button
            disabled={loading}
            type="submit"
            className="bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="bg-white text-black font-semibold py-2 rounded mt-4 w-full hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        {message && (
          <p className="text-center text-sm text-yellow-300 mt-4">{message}</p>
        )}

        <p
          onClick={toggleMode}
          className="text-center mt-4 text-sm text-gray-300 cursor-pointer hover:text-white"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
