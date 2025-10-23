import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/home");
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/home`,
          },
        });

        if (error) throw error;

        // Try to create profile immediately if session is available
        const userId = data?.user?.id || data?.session?.user?.id;
        if (userId) {
          await supabase.from("profiles").insert([
            {
              id: userId,
              email,
              username,
              created_at: new Date().toISOString(),
            },
          ]);
        }

        setMessage("Signup successful! Please check your email to confirm your account.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong!");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) setMessage(error.message);
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
              className="p-2 rounded bg-gray-700 outline-none"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-700 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 outline-none"
            required
          />

          <button
            disabled={loading}
            type="submit"
            className="bg-primary text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
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
