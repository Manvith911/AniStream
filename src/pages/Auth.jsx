import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signUp, loginWithGoogle } from "../services/Auth";
import { FaGoogle } from "react-icons/fa";
import Logo from "../components/Logo";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    gender: "",
    bio: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isLogin) {
      const { error } = await login(form.email, form.password);
      setLoading(false);
      if (error) setErrorMsg(error);
      else navigate("/home");
    } else {
      const { error } = await signUp(form);
      setLoading(false);
      if (error) setErrorMsg(error);
      else navigate("/home");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await loginWithGoogle();
    if (error) {
      setErrorMsg(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-20 blur-3xl rounded-full -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 opacity-20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-md bg-card/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-700 p-8 text-center">
        <Logo />
        <h2 className="text-2xl font-bold text-white mt-4 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isLogin
            ? "Login to continue exploring anime"
            : "Join the anime community!"}
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

          {!isLogin && (
            <>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Username"
                className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                rows="3"
                className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </>
          )}

          {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-2 font-semibold rounded-md transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-primary hover:bg-yellow-400 text-black"
            }`}
          >
            {loading ? (isLogin ? "Logging in..." : "Creating account...") : isLogin ? "Login" : "Sign Up"}
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
          {isLogin
            ? "Don’t have an account? "
            : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
