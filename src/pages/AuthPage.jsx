import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-md shadow-md bg-white w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign in</h2>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded bg-[#4285F4] text-white"
          disabled={loading}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 488 512"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              fill="white"
              d="M488 261.8C488 403 391.1 512 248.7 512 111.6 512 0 400.4 0 263.3S111.6 14.7 248.7 14.7c66.8 0 124 23.9 166.3 63.9l-67.5 64C322.1 129.5 286.3 112 248.7 112c-94.3 0-171 75.6-171 168.7S154.4 449.3 248.7 449.3c99.4 0 128.2-71.4 134.2-108.7H248.7v-86.8h239.3z"
            />
          </svg>
          <span>{loading ? "Loading..." : "Continue with Google"}</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          You will be redirected to Google to sign in. If you already have an account,
          it will sign you in automatically.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
