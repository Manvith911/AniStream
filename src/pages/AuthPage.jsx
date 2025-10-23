import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createEmptyProfile = async (userId, email) => {
    try {
      await supabase.from("profiles").insert([
        {
          id: userId,
          email,
          username: "",
          gender: "",
          avatar_url: "",
          bio: "",
        },
      ]);
    } catch (err) {
      console.error("Error creating profile:", err.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data?.user?.id) await createEmptyProfile(data.user.id, email);
        toast.success("Account created! Check your email to verify.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // ensure profile exists
        const { data: profileExists } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (!profileExists) await createEmptyProfile(data.user.id, email);

        toast.success("Logged in successfully!");
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
    } catch {
      toast.error("Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-backGround text-white px-4">
      <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleAuth} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="bg-lightBg p-2 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-lightBg p-2 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary text-black font-semibold py-2 rounded hover:opacity-90"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <div className="w-1/4 border-t border-gray-500"></div>
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <div className="w-1/4 border-t border-gray-500"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-2 bg-white text-black font-semibold py-2 rounded w-full mt-4 hover:opacity-90"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
