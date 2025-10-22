import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Auth = () => {
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
        // 🧩 1️⃣ Sign up user and send verification link
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (error) throw error;

        alert("✅ Check your email for a confirmation link before logging in.");
      } else {
        // 🧩 2️⃣ Login (only works after email confirmed)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // 🧩 3️⃣ Check if profile exists
        const user = data?.user;
        if (user) {
          const { data: existingProfile, error: selectError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (selectError && selectError.code !== "PGRST116") throw selectError;

          // 🧩 4️⃣ If profile doesn’t exist (first login after confirmation), create one
          if (!existingProfile) {
            const { error: insertError } = await supabase.from("profiles").insert([
              {
                id: user.id,
                email: user.email,
                username: user.email.split("@")[0],
              },
            ]);
            if (insertError) throw insertError;
          }
        }

        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-card">
      <form
        onSubmit={handleAuth}
        className="bg-backGround p-8 rounded-lg shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-center text-xl font-bold text-primary">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded p-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded p-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-black rounded p-2 font-bold hover:opacity-90 transition"
        >
          {loading
            ? "Please wait..."
            : isSignUp
            ? "Sign Up"
            : "Login"}
        </button>

        <p className="text-sm text-center text-gray-700">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
