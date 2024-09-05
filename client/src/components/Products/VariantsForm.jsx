import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditVariantForm({ onClose, refreshVariants, initialData, isEditMode, product }) {
  const [formData, setFormData] = useState({
    sku: "",
    option1: "",
    price: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || "",
        option1: initialData.option1 || "",
        price: initialData.price || "",
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

    const variantData = {
      sku: formData.sku,
      option1: formData.option1,
      price: formData.price,
    };

    try {
      if (isEditMode) {
        await axios.put(`${backendUrl}/api/products/${product.id}/variants/${initialData.id}`, variantData);
        toast.success("Variant updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/products/${product.id}/variants`, variantData);
        toast.success("Variant created successfully!");
      }

      setFormData({
        sku: "",
        option1: "",
        price: "",
      });
      refreshVariants();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditMode ? "Edit Variant" : "Add Variant"}
      </h2>
      <div className="mb-4">
        <label htmlFor="sku" className="block mb-2">
          SKU
        </label>
        <input
          type="text"
          id="sku"
          name="sku"
          placeholder="Variant SKU"
          value={formData.sku}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="option1" className="block mb-2">
          Title
        </label>
        <input
          type="text"
          id="option1"
          name="option1"
          placeholder="Variant Title"
          value={formData.option1}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Variant Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
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
          ) : (
            isEditMode ? "Update Variant" : "Add Variant"
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

export default EditVariantForm;
