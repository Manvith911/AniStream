import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Sign Up ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, password, username } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/confirmed`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "✅ Check your email for a confirmation link before logging in."
      );
    }
    setLoading(false);
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, password } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else if (data.session) {
      await ensureProfile(data.session.user);
      navigate("/");
    }
    setLoading(false);
  };

  // --- Google Sign-In ---
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) setMessage(error.message);
    setLoading(false);
  };

  // --- Ensure Profile Exists ---
  const ensureProfile = async (user) => {
    if (!user) return;
    const { id, email, user_metadata } = user;

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .single();

    if (!data) {
      await supabase.from("profiles").insert([
        {
          id,
          email,
          username: user_metadata.username || email.split("@")[0],
          avatar_url: user_metadata.avatar_url || "",
        },
      ]);
    } else if (error && error.code !== "PGRST116") {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backGround">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-primary">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleSignUp}
          className="flex flex-col gap-4"
        >
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded-md bg-backGround text-white"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-md bg-backGround text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-md bg-backGround text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-black font-semibold py-2 rounded-md hover:opacity-90"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Creating account..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:opacity-90"
        >
          Continue with Google
        </button>

        {message && (
          <p className="text-center text-sm text-primary mt-3">{message}</p>
        )}

        <div className="text-center mt-4">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
