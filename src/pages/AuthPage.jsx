import { useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let user;

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        user = data.user;
        if (!user.email_confirmed_at) {
          setMessage("Please verify your email before logging in.");
          setLoading(false);
          return;
        }

        window.location.href = "/";
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        user = data.user;

        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
        });

        setMessage("Sign-up successful! Check your email to verify before logging in.");
      }
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back 👋" : "Create an Account"}
        </h2>

        {message && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="relative text-center my-4">
          <span className="bg-white px-2 text-gray-400 text-sm">OR</span>
          <hr className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 border-gray-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-600 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
