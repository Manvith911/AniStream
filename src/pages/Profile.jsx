import { useAuth } from "../services/useAuth";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-300">
        Please <span onClick={() => navigate("/login")} className="text-sky-400 cursor-pointer underline">login</span> to view your profile.
      </div>
    );

  return (
    <div className="flex flex-col items-center mt-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-gray-300">Email: {user.email}</p>
      <p className="text-gray-300">Username: {user.user_metadata?.username}</p>

      <button
        onClick={handleLogout}
        className="mt-5 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
