import { Navigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
