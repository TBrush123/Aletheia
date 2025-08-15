import Textbox from "../components/Textbox";
import AuthLink from "../components/AuthLink";
import Submit from "../components/Submit";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Poll Insights
        </h1>

        <Textbox placeholder="Enter username" />
        <Textbox placeholder="Enter password" type="password" />

        <div className="flex justify-between text-sm mb-4">
          <AuthLink text="Register now" />
          <AuthLink text="Forgot password?" />
        </div>

        <Submit text="Login" />

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
