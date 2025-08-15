import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          AI Poll Insights
        </span>
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li
            className={`${
              activeTab === "home"
                ? "border-b-4 border-blue-500"
                : "border-b-4 border-transparent hover:border-gray-200"
            } p-3`}
          >
            <Link
              to="/"
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === "home"
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
              onClick={() => setActiveTab("home")}
            >
              Home
            </Link>
          </li>
          <li
            className={`${
              activeTab === "login"
                ? "border-b-4 border-blue-500"
                : "border-b-4 border-transparent hover:border-gray-200"
            } p-3`}
          >
            <Link
              to="/login"
              className={`flex-1 py-2 text-center font-medium ${
                activeTab === "login"
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-800 dark:hover:text-gray-300`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
