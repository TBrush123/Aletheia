import Textbox from "../components/Textbox";
import Submit from "../components/Submit";
import { authService } from "../services/authService";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await authService.login(username, password);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Poll Insights
        </h1>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-yellow-400 py-2 rounded font-bold"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-around">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Facebook
          </button>
          <button className="bg-blue-400 text-white px-4 py-2 rounded">
            Twitter
          </button>
        </div>
      </div>
    </div>
  );
}
