import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import AddUserForm from "../Users/UsersForm";
import { toast } from "react-toastify";
import axios from "axios";
import Error from "../Error/Error"
import ConfirmationModal from "../Utils/ConfirmationModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Users() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const itemsPerPage = 5;

  const loggedInUserId = loggedInUser;
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "api/users/getallusers");
      setUsers(response.data.users);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    if (user._id === loggedInUserId) {
      toast.error("You cannot delete the currently logged-in user.");
      return;
    }
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const openModal = (userId) => {
    if (userId === loggedInUserId) {
      toast.error("You cannot delete the currently logged-in user.");
      return;
    }
    setModalIsOpen(true);
    setUserToDelete(userId);
    setIsBulkDelete(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUserToDelete(null);
  };

  const closeAddModal = () => {
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${backendUrl}api/users/${userToDelete}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete)
      );
      toast.success("User deleted successfully");
      setIsLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting users:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedUsers.length === currentItems.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentItems.map((user) => user._id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      if (selectedUsers.includes(loggedInUserId)) {
        toast.error("You cannot delete the currently logged-in user.");
        return;
      }
      setUserToDelete(selectedUsers);
      setModalIsOpen(true);
      setIsBulkDelete(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        userToDelete.map((userId) =>
          axios.delete(`${backendUrl}api/users/${userId}`)
        )
      );
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !userToDelete.includes(user._id))
      );
      setSelectedUsers([]);
      closeModal();
      toast.success("User or Users deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Error deleting users:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Error error={error} />
    )
  }
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="container px-4 mx-auto mt-8">
      <h2 className="text-lg font-medium text-gray-800">User Details</h2>
      <div className="flex items-center justify-end gap-x-3 mt-6">
        {selectedUsers.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center justify-center h-12 w-12 px-2 text-white bg-red-600 rounded-full hover:bg-red-500 focus:outline-none"
          >
            <FaRegTrashCan size={24} />
          </button>
        )}
        <button
          onClick={handleAddUser}
          className="flex items-center justify-center h-12 w-12 px-2 text-white bg-blue-400 rounded-full hover:bg-blue-500 focus:outline-none"
        >
          <FaPlus size={24} />
        </button>
      </div>
      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <AddUserForm
              onClose={closeAddModal}
              refreshUsers={fetchUsers}
              initialData={editingUser}
              isEditMode={!!editingUser}
            />
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="text-blue-500 border-gray-300 rounded"
                    onChange={handleSelectAllChange}
                    checked={selectedUsers.length === currentItems.length}
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  User
                  {sortConfig.key === "username" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="relative py-3.5
                  px-4"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="text-blue-500 border-gray-300 rounded"
                      onChange={() => handleCheckboxChange(user._id)}
                      checked={selectedUsers.includes(user._id)}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="object-cover w-10 h-10 rounded-full mr-2"
                        src={backendUrl + user.avatar}
                        alt={user.username + " avatar"}
                      />
                      <div>
                        <h2 className="font-medium text-gray-800">
                          {user.username}
                        </h2>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {user.role}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${user.status === "active"
                          ? "bg-emerald-100/60"
                          : "bg-red-100/60"
                        }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${user.status === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                          }`}
                      ></span>
                      <span
                        className={`text-sm font-normal ${user.status === "active"
                            ? "text-emerald-500"
                            : "text-red-500"
                          }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-x-6">
                      <div className="h-auto w-auto">
                        <button
                          className="text-red-600 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                          onClick={() => openModal(user._id)}
                        >
                          <FaRegTrashCan size={22} />
                        </button>
                      </div>
                      <div className="h-auto w-auto">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                        >
                          <FaRegEdit size={22} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span>Previous</span>
        </button>
        <div className="items-center hidden lg:flex gap-x-3">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 py-1 text-sm rounded-md ${currentPage === index + 1
                  ? "text-blue-500 bg-blue-100"
                  : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onConfirm={isBulkDelete ? handleConfirmBulkDelete : handleDeleteUser}
        isLoading={isLoading}
        isBulkDelete={isBulkDelete}
      />
    </section>
  );
}

export default Users;
