import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <Link to="/">AI Poll Insights</Link>
        </span>
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          {user ? (
            <>
              <li>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    navigate("/polls/create");
                  }}
                >
                  <span className="font-extrabold">+</span> Create Poll
                </button>
              </li>
              <li
                className={`${
                  isActive("/profile")
                    ? "border-b-2 border-blue-500"
                    : "border-b-2 border-transparent hover:border-gray-200"
                } p-3`}
              >
                <Link
                  to="/profile"
                  className={`flex-1 py-2 text-center font-medium ${
                    isActive("/profile")
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
                >
                  {user.username}
                </Link>
              </li>
              <li
                className={`${
                  isActive("/logout")
                    ? "border-b-2 border-blue-500"
                    : "border-b-2 border-transparent hover:border-gray-200"
                } p-3`}
              >
                <Link
                  to="/logout"
                  className={`flex-1 py-2 text-center font-medium ${
                    isActive("/logout")
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-800 dark:hover:text-red-300`}
                >
                  Log out
                </Link>
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
