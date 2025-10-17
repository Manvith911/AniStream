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

        // create profile automatically
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Sign Up"}</h2>
        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
          <button type="submit"
            className="bg-primary text-white py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
            disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">OR</div>
        <button onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition w-full">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="text-primary cursor-pointer font-semibold" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
