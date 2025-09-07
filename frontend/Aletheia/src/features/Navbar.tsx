import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navigate = useNavigate();

  return (
    <nav className="bg-background border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <span className="text-2xl font-semibold text-gray-900">
          <Link to="/">Aletheia</Link>
        </span>

        {/* Links */}
        <ul className="flex items-center space-x-8 font-medium text-lg">
          {user ? (
            <>
              <li>
                <Button
                  className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-md font-medium transition-colors hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  onClick={() => navigate("/polls/create")}
                >
                  + Create Poll
                </Button>
              </li>
              <li>
                <Link
                  to="/polls"
                  className={`${
                    isActive("/polls")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  } transition-colors`}
                >
                  My Polls
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`${
                    isActive("/profile")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  } transition-colors`}
                >
                  {user.username}
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className={`${
                    isActive("/logout")
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  } transition-colors`}
                >
                  Log out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`${
                    isActive("/login")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  } transition-colors`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`${
                    isActive("/register")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  } transition-colors`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
