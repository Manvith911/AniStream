// src/pages/Auth.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user) {
      // if already logged in, go to profile or home
      navigate("/profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      // OAuth redirects away — no need to navigate
    } catch (err) {
      alert("Signin failed. See console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backGround p-4">
      <div className="max-w-md w-full bg-card rounded-md shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Sign in / Sign up</h2>
        <p className="text-sm mb-6">
          Sign in with Google. We'll create a profile row for you automatically.
        </p>
        <button
          onClick={handleGoogle}
          className="w-full py-2 bg-primary text-black rounded-md flex items-center justify-center gap-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
