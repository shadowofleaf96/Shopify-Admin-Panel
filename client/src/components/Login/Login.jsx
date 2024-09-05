import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/users/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/");
      setLoading(false);
    } catch (err) {
      toast.error(error);
      setError(err.response.data.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen m-auto flex items-center">
      <div className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-12 sm:h-12"
            src="../../../logo-wlidaty.webp"
            alt=""
          />
        </div>
        <form className="mt-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-800">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm text-gray-800">
                Password
              </label>
              {/* Could be added Later */}
              {/* <a href="#" className="text-xs text-gray-600 hover:underline">
                Forget Password?
              </a> */}
            </div>
            <input
              type="password"
              name="password"
              value={password}
              autoComplete="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-6">
            {(loading && (
              <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                <FaSpinner size={22} className="py-0.5 animate-spin text-white mx-auto" />
              </button>
            )) || (
              <button className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                <div className="py-0.5">Sign In</div>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
