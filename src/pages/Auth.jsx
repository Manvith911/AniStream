import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await signIn({ email, password });
    } else {
      await signUp({ email, password });
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-dark text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-lg w-full max-w-sm space-y-5"
      >
        <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-dark focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-dark focus:outline-none"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-black rounded-lg font-semibold hover:opacity-80"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p className="text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
