import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/"); // redirect to homepage after login
      }
    };
    handleAuth();
  }, [navigate]);

  return <div className="text-center mt-10">Logging you in...</div>;
};

export default AuthCallback;
