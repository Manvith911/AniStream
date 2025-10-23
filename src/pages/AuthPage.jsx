import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Sign Up flow
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        alert(error.message);
      } else if (data.user) {
        // Create profile entry
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email,
            username,
            avatar_url: "",
            bio: "",
          },
        ]);
        alert("Signup successful! Please check your email for confirmation.");
      }
    } else {
      // Sign In flow
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-backGround text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-6 rounded-lg shadow-md w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-lightBg focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            className="p-2 rounded bg-lightBg focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-lightBg focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-primary text-black py-2 rounded font-semibold"
        >
          {isSignUp ? "Create Account" : "Login"}
        </button>
        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-center cursor-pointer hover:text-primary"
        >
          {isSignUp ? "Already have an account? Login" : "No account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
