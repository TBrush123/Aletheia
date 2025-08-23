import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          AI Poll Insights
        </span>
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li
            className={`${
              isActive("/")
                ? "border-b-2 border-blue-500"
                : "border-b-2 border-transparent hover:border-gray-200"
            } p-3`}
          >
            <Link
              to="/"
              className={`flex-1 py-2 text-center font-medium ${
                isActive("/")
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={
                    isActive("/profile")
                      ? "border-b-2 border-blue-500 pb-1"
                      : "hover:underline"
                  }
                >
                  {user.username}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li
                className={`${
                  isActive("/login")
                    ? "border-b-2 border-blue-500"
                    : "border-b-2 border-transparent hover:border-gray-200"
                } p-3`}
              >
                <Link
                  to="/login"
                  className={`flex-1 py-2 text-center font-medium ${
                    isActive("/login")
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
                >
                  Login
                </Link>
              </li>
              <li
                className={`${
                  isActive("/register")
                    ? "border-b-2 border-blue-500"
                    : "border-b-2 border-transparent hover:border-gray-200"
                } p-3`}
              >
                <Link
                  to="/register"
                  className={`flex-1 py-2 text-center font-medium ${
                    isActive("/register")
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
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
