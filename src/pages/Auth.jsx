import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signUp, loginWithGoogle } from "../services/Auth";
import notify from "../utils/notify";
import { FaGoogle } from "react-icons/fa";
import Logo from "../components/Logo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await login(form.email, form.password);
      setLoading(false);
      if (error) notify("error", error);
      else {
        notify("success", "Logged in successfully!");
        navigate("/home");
      }
    } else {
      const { error } = await signUp(form);
      setLoading(false);
      if (error) notify("error", error);
      else notify("success", "Confirmation email sent! Please verify to login.");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await loginWithGoogle();
    setLoading(false);
    if (error) notify("error", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative z-10 w-full max-w-md bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-700 p-8 text-center">
        <Logo />
        <h2 className="text-2xl font-bold text-white mt-4 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isLogin ? "Login to continue exploring anime" : "Sign up to join the community"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-2 font-semibold rounded-md transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-primary hover:bg-yellow-400 text-black"
            }`}
          >
            {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-600" />
          <span className="text-gray-400 text-xs px-2">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-all"
        >
          <FaGoogle className="text-lg" /> Continue with Google
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          {isLogin ? "Don’t have an account? " : "Already have an account? "}
          <span onClick={toggleMode} className="text-primary cursor-pointer hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
