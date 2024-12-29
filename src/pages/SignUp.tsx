import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/common.css";

const SignUp: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
