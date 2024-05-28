import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { FiUser, FiLogOut } from "react-icons/fi";
import LoadingSpinner from "../Utils/LoadingSpinner";
import { FaSpinner } from "react-icons/fa6";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    setLoggedInUser(user?._id);
  }, [user]);

  const handleLogout = () => {
    setLoading(true);
    axios
      .get(`${backendUrl}api/users/logout`, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/login");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        setLoading(false);
      });
  };

  return (
    <>
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 bg-white border-b text-sm py-2.5 sm:py-4">
        <nav
          className="max-w-7xl flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <a className="me-5 md:me-8" href="/">
            <img
              className="flex-none text-xl font-semibold"
              src="/logo-wlidaty.webp"
              aria-label="Brand"
            />
          </a>

          <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
            <div className="sm:invisible">
              <button
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center gap-2 size-[38px] rounded-full font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            <div className="invisible sm:block mx-auto">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                  <svg
                    className="flex-shrink-0 size-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="py-2 pe-4 ps-10 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Search"
                />
              </div>
            </div>

            {user && (
              <div className="flex flex-row items-center justify-end gap-2">
                <div className="relative inline-flex">
                  <button
                    id="hs-dropdown-with-header"
                    type="button"
                    className="hs-dropdown-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      className="inline-block h-[38px] w-[38px] rounded-full ring-2 ring-white"
                      src={backendUrl + user.avatar}
                      alt="User Avatar"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-2 px-4 flex items-center gap-2">
                        <FiUser className="text-gray-700" />
                        <span className="block text-sm font-semibold">
                          {user.username}
                        </span>
                      </div>
                      <div className="py-1 border-t border-gray-200">
                        <button
                          className="flex w-full text-left py-2 text-sm text-red-900 hover:bg-gray-100 items-center gap-2"
                          onClick={handleLogout}
                        >
                          {(loading && <LoadingSpinner />) || (
                            <div className="py-2 px-4 flex items-center gap-2">
                              <FiLogOut className="text-red-900" />
                              <span className="block text-sm font-semibold">
                                Logout
                              </span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
