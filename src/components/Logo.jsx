import { Link } from "react-router-dom";
import favicon from "../assets/favicon1.png"; // adjust the path if needed

const Logo = () => {
  return (
    <Link to="/home" className="flex items-center space-x-2 select-none">
      <img
        src={favicon}
        alt="AniStream Logo"
        className="w-6 h-6 object-contain"
      />
      <h1 className="gradient-text text-xl">AniStream</h1>
    </Link>
  );
};

export default Logo;
