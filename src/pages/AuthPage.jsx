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

  // --- Email/Password Auth ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/home");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data?.user) {
          // Create profile record
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert([
              {
                id: data.user.id,
                username,
                email: data.user.email,
              },
            ]);
          if (profileError)
            console.warn("Profile creation deferred:", profileError.message);
        }

        setMessage(
          "Confirmation email sent instantly! Please check your inbox to verify your account."
        );
      }
    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  // --- Google OAuth Login ---
  const handleGoogleLogin = async () => {
    try {
      setMessage("Redirecting to Google...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
      if (data?.user) {
        const user = data.user;
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert([
            {
              id: user.id,
              email: user.email,
              username: user.user_metadata?.full_name || user.email.split("@")[0],
              avatar_url: user.user_metadata?.avatar_url || null,
            },
          ]);
        if (profileError)
          console.warn("Profile creation deferred:", profileError.message);
      }
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
            className="bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
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
