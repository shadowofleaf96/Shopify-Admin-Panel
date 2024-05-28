import React, { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(backendUrl + "api/orders");
        setOrders(response.data.orders);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

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
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium text-gray-800">Orders Details</h2>
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
                        <span>Order ID</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Email</span>
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Created At</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Total Price</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      <span>Status</span>
                    </th>
                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-6 text-sm font-medium text-gray-800 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex items-center gap-x-2">
                            <h2 className="font-medium text-gray-800">
                              {order.name}
                            </h2>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.customer.email}
                      </td>
                      <td className="px-12 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        })}{" "}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.current_total_price} DH
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.financial_status}
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
          className={`flex items-center px-5 py-2 text-sm text-gray-800 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
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
          className={`flex items-center px-5 py-2 text-sm text-gray-800 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 ${
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

export default Orders;
