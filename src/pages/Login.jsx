import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../services/Auth";
import { FaGoogle } from "react-icons/fa";
import Logo from "../components/Logo";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await login(email, password);
    setLoading(false);
    if (error) setErrorMsg(error);
    else navigate("/");
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
        <h2 className="text-2xl font-bold text-white mt-4 mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-sm mb-6">Login to continue exploring anime</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="px-4 py-2 rounded-md bg-[#FBF8EF] text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />

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
            {loading ? "Logging in..." : "Login"}
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

        <p className="text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
