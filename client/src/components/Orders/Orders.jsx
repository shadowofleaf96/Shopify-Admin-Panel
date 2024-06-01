import React, { useEffect, useState, useContext } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import EditOrderForm from "../Orders/OrdersForm";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "../Utils/ConfirmationModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [editingorder, setEditingorder] = useState(null);
  const [orderToDelete, setorderToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "api/orders");
      setOrders(response.data.orders);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditOrder = (order) => {
    setEditingorder(order);
    setShowEditOrderModal(true);
  };

  const openModal = (orderId) => {
    setModalIsOpen(true);
    setorderToDelete(orderId);
    setIsBulkDelete(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setorderToDelete(null);
  };

  const closeAddModal = () => {
    setShowEditOrderModal(false);
    setEditingorder(null);
  };

  const handleDeleteorder = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${backendUrl}api/orders/${orderToDelete}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete)
      );
      toast.success("order deleted successfully");
      setIsLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting Orders:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedOrders.length === currentItems.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentItems.map((order) => order.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length > 0) {
      setorderToDelete(selectedOrders);
      setModalIsOpen(true);
      setIsBulkDelete(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        orderToDelete.map((orderId) =>
          axios.delete(`${backendUrl}api/orders/${orderId}`)
        )
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => !orderToDelete.includes(order.id))
      );
      setSelectedOrders([]);
      closeModal();
      toast.success("order or Orders deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting Orders:", error);
      toast.error("Error deleting Orders:", error);
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

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

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
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
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
      <h2 className="text-lg font-medium text-gray-800">Orders Details</h2>
      <div className="flex items-center justify-end gap-x-3 mt-6">
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center justify-center h-12 w-12 px-2 text-white bg-red-600 rounded-full hover:bg-red-500 focus:outline-none"
          >
            <FaRegTrashCan size={24} />
          </button>
        )}
      </div>
      {showEditOrderModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <EditOrderForm
              onClose={closeAddModal}
              refreshOrders={fetchOrders}
              initialData={editingorder}
              isEditMode={!!editingorder}
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
                    checked={selectedOrders.length === currentItems.length}
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("ordername")}
                >
                  Order ID
                  {sortConfig.key === "ordername" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Orderer Shipping Name
                  {sortConfig.key === "email" &&
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
                  onClick={() => handleSort("email")}
                >
                  Mobile Number
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Shipping Address{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  City
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Price{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="text-blue-500 border-gray-300 rounded"
                      onChange={() => handleCheckboxChange(order.id)}
                      checked={selectedOrders.includes(order.id)}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <h2 className="font-medium text-gray-800">
                          {order.name}
                        </h2>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {`${order.shipping_address.first_name} ${order.shipping_address.last_name}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {order.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {order.phone}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {`${order.shipping_address.address1} ${order.shipping_address.address2}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                    {order.shipping_address.city}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {order.total_price} DH
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-x-6">
                      <div className="h-auto w-auto">
                        <button
                          className="text-gray-800 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                          onClick={() => openModal(order.id)}
                        >
                          <FaRegTrashCan size={22} />
                        </button>
                      </div>
                      <div className="h-auto w-auto">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-gray-800 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
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
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onConfirm={isBulkDelete ? handleConfirmBulkDelete : handleDeleteorder}
        isLoading={isLoading}
        isBulkDelete={isBulkDelete}
      />
    </section>
  );
}

export default Orders;
