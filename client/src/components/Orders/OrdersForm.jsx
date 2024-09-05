import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditOrderForm({ onClose, refreshOrders, initialData }) {
  const [formData, setFormData] = useState({
    ordererFirstName: "",
    ordererLastName: "",
    email: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ordererFirstName: initialData.shipping_address.first_name || "",
        ordererLastName: initialData.shipping_address.last_name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phone || "",
        address1: initialData.shipping_address.address1 || "",
        address2: initialData.shipping_address.address2 || "",
        city: initialData.shipping_address.city || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const orderData = new FormData();
    for (let key in formData) {
      if (formData[key]) {
        orderData.append(key, formData[key]);
      }
    }

    const submittedOrderData = {
      email: formData.email,
      phone: formData.phoneNumber,
      shipping_address: {
        first_name: formData.ordererFirstName,
        last_name: formData.ordererLastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
      },
    };

    try {
      await axios.put(
        `${backendUrl}/api/orders/${initialData.id}`,
        submittedOrderData
      );
      toast.success("Order updated successfully!");
      setFormData({
        ordererFirstName: "",
        ordererLastName: "",
        email: "",
        phoneNumber: "",
        address1: "",
        address2: "",
        city: "",
      });
      refreshOrders();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Order</h2>
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="orderId" className="block mb-2">
            Orderer First Name
          </label>
          <input
            type="text"
            id="ordererFirstName"
            name="ordererFirstName"
            placeholder="John"
            value={formData.ordererFirstName}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="orderId" className="block mb-2">
            Orderer Last Name
          </label>
          <input
            type="text"
            id="ordererLastName"
            name="ordererLastName"
            placeholder="Doe"
            value={formData.ordererLastName}
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
          <label htmlFor="totalPrice" className="block mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="060"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address1" className="block mb-2">
            Address 1
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            placeholder="060"
            value={formData.address1}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address2" className="block mb-2">
            Address 2
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            placeholder="060"
            value={formData.address2}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Casa"
            value={formData.city}
            onChange={handleChange}
            required
            className="border bg-white border-gray-300 p-2 rounded w-full"
          />
        </div>
      </div>
      <div className="flex justify-center items-start">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white py-2 font-light px-4 rounded transition-colors duration-200 hover:bg-blue-600"
        >
          {isSubmitting ? (
            <FaSpinner className="w-auto py-1 px-3 h-auto animate-spin text-white" />
          ) : (
            "Update Order"
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

export default EditOrderForm;
