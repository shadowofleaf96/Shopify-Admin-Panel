import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";
import AxiosConfig from "../Utils/AxiosConfig";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditProductForm({ onClose, refreshProducts, initialData, isEditMode }) {
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body_html: "",
    vendor: "",
    product_type: "",
    tags: "",
    status: "active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        body_html: initialData.body_html || "",
        vendor: initialData.vendor || "",
        product_type: initialData.product_type || "",
        tags: initialData.tags || "",
        status: initialData.status || "active",
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

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const productData = {
      title: formData.title,
      body_html: formData.body_html,
      vendor: formData.vendor,
      product_type: formData.product_type,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      status: formData.status,
      images: imageFile
        ? [{ attachment: await convertImageToBase64(imageFile) }]
        : [],
    };

    try {
      if (isEditMode) {
        await AxiosConfig.put(
          `/products/${initialData.id}`,
          productData
        );
        toast.success("Product updated successfully!");
      } else {
        await AxiosConfig.post(`/products`, productData);
        toast.success("Product created successfully!");
      }

      setFormData({
        title: "",
        body_html: "",
        vendor: "",
        product_type: "",
        tags: "",
        status: "active",
      });
      setImageFile(null);
      refreshProducts();
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
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="body_html" className="block mb-2">
          Description (HTML)
        </label>
        <textarea
          id="body_html"
          name="body_html"
          placeholder="Product Description"
          value={formData.body_html}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="vendor" className="block mb-2">
          Vendor
        </label>
        <input
          type="text"
          id="vendor"
          name="vendor"
          placeholder="Vendor Name"
          value={formData.vendor}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="product_type" className="block mb-2">
          Product Type
        </label>
        <input
          type="text"
          id="product_type"
          name="product_type"
          placeholder="Product Type"
          value={formData.product_type}
          onChange={handleChange}
          required
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          placeholder="tag1, tag2, tag3"
          value={formData.tags}
          onChange={handleChange}
          className="border bg-white border-gray-300 p-2 rounded w-full"
        />
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
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-2">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
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
          ) : isEditMode ? (
            "Update Product"
          ) : (
            "Add Product"
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

export default EditProductForm;
