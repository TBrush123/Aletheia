import { useAuth } from "../context/AuthContext";

function Logout() {
  const { logout } = useAuth();
  logout();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">You have been logged out</h1>
        <p className="text-gray-700">Thank you for using AI Poll Insights!</p>
      </div>
    </div>
  );
}

export default Logout;
