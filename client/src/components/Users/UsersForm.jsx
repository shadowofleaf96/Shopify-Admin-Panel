import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AddUserForm({
  onClose,
  refreshUsers,
  initialData = null,
  isEditMode = false,
}) {
  const [formData, setFormData] = useState({
    avatar: null,
    username: "",
    password: "",
    role: "admin",
    email: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        avatar: null,
        username: initialData.username || "",
        password: "",
        role: initialData.role || "admin",
        email: initialData.email || "",
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userData = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        userData.append(key, formData[key]);
      }
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${backendUrl}/api/users/${initialData._id}`,
          userData
        );
        toast.success("User updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/users/register`, userData);
        toast.success("User added successfully!");
      }

      setFormData({
        avatar: null,
        username: "",
        password: "",
        role: "admin",
        email: "",
        status: "active",
      });
      refreshUsers();
      onClose();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditMode ? "Edit User" : "Add User"}
      </h2>
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Example: Admin"
            value={formData.username}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Example: 123456"
            value={formData.password}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Example: example@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border bg-white border-gray-300 p-2 rounded w-full"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="delivery">Delivery Person</option>
            <option value="controller">Inventory Controller</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border bg-white border-gray-300 p-2 rounded w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="avatar" className="block mb-2">
          Avatar
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="flex justify-center items-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white py-2 font-light px-4 rounded transition-colors duration-200 hover:bg-blue-600"
        >
          {isSubmitting ? (
            <FaSpinner className="w-auto py-1 px-3 h-auto animate-spin text-white" />
          ) : isEditMode ? (
            "Update User"
          ) : (
            "Add User"
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-light py-2 px-4 ml-4"
        >
          Close
        </button>
      </div>
    </form>
  );
}

export default AddUserForm;
