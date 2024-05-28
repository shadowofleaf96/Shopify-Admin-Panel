import React, { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa6";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(backendUrl + "api/products");
        setProducts(response.data.products);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner size={40} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

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
      <div className="flex items-center justify-between gap-x-3">
        <h2 className="text-lg font-medium text-gray-800">Product Details</h2>
        <button className="flex items-center justify-center h-12 w-12 text-white bg-blue-400 rounded-full hover:bg-blue-500 focus:outline-none">
          <FaPlus size={24} />
        </button>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <div className="flex items-center gap-x-3">
                        <input
                          type="checkbox"
                          className="text-blue-500 border-gray-300 rounded"
                        />
                        <span>Product Name</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Status</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Type</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Price</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Inventory Stock</span>
                    </th>
                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex items-center gap-x-2">
                            <img
                              className="object-cover w-10 h-10 rounded-full"
                              src={product.image?.src}
                              alt={product.image?.alt}
                            />
                            <div>
                              <h2 className="font-medium text-gray-800">
                                {product.title}
                              </h2>
                              <p className="text-sm font-normal text-gray-800">
                                {product.handle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                            product.status === "active"
                              ? "bg-emerald-100/60"
                              : "bg-red-100/60"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.status === "active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          <h2
                            className={`text-sm font-normal ${
                              product.status === "active"
                                ? "text-emerald-500"
                                : "text-red-500"
                            }`}
                          >
                            {product.status.charAt(0).toUpperCase() +
                              product.status.slice(1)}
                          </h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.product_type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.variants
                          .map((variant) => `${variant.price} MAD`)
                          .join(", ")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {product.variants
                          .map((variant) => `${variant.inventory_quantity}`)
                          .join(", ")}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-6">
                          <button className="text-gray-800 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                            <FaRegTrashCan size={20} />
                          </button>
                          <button className="text-gray-800 transition-colors duration-200 hover:text-yellow-500 focus:outline-none">
                            <FaRegEdit size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
              className={`px-2 py-1 text-sm rounded-md ${
                currentPage === index + 1
                  ? "text-blue-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
    </section>
  );
}

export default Products;
