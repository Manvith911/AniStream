import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        // Create an empty profile row
        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              email: data.user.email,
              username: data.user.email.split("@")[0],
              avatar_url: "",
            },
          ]);
        }

        alert("Check your email for confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <form
        onSubmit={handleAuth}
        className="bg-card p-6 rounded-lg shadow-md w-80 flex flex-col gap-3"
      >
        <h2 className="text-center font-bold text-lg text-primary">
          {isSignUp ? "Create Account" : "Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-black font-semibold py-2 rounded-md"
        >
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
        </button>

        <p
          className="text-center text-sm mt-2 cursor-pointer text-primary"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
