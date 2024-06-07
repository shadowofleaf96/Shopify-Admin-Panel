import React, { useEffect, useState, useContext } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit, FaTimes } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import EditProductForm from "../Products/ProductsForm";
import EditVariantForm from "../Products/VariantsForm";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "../Utils/ConfirmationModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Products() {
  const [products, setProducts] = useState([]);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [expandedProductIds, setExpandedProductIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [isVariantDelete, setIsVariantDelete] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [editingProductForVariant, setEditingProductForVariant] =
    useState(null);

  const itemsPerPage = 5;
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "api/products");
      setProducts(response.data.products);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowEditProductModal(true);
  };

  const handleAddVariant = (product) => {
    setEditingProductForVariant(product);
    setEditingVariant(null);
    setShowEditVariantModal(true);
  };

  const handleEditVariant = (product, variant) => {
    setEditingProductForVariant(product);
    setEditingVariant(variant);
    setShowEditVariantModal(true);
  };

  const closeEditVariantModal = () => {
    setShowEditVariantModal(false);
    setEditingVariant(null);
    setEditingProductForVariant(null);
  };

  const openModal = (productId) => {
    setModalIsOpen(true);
    setProductToDelete(productId);
    setIsBulkDelete(false);
    setIsVariantDelete(false);
  };

  const openVariantModal = (productId, variantId) => {
    setModalIsOpen(true);
    setProductToDelete(productId);
    setVariantToDelete(variantId);
    setIsBulkDelete(false);
    setIsVariantDelete(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProductToDelete(null);
  };

  const closeAddModal = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${backendUrl}api/products/${productToDelete}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productToDelete)
      );
      toast.success("Product deleted successfully");
      setIsLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("Error deleting Product:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleDeleteVariant = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${backendUrl}api/products/${productToDelete}/variants/${variantToDelete}`
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          if (product.id === productToDelete) {
            return {
              ...product,
              variants: product.variants.filter(
                (variant) => variant.id !== variantToDelete
              ),
            };
          }
          return product;
        })
      );

      toast.success("Product variant deleted successfully");
      setIsLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("Error deleting Product:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleProductCheckboxChange = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const handleToggleVariantExpansion = (productId) => {
    setExpandedProductIds((prevIds) =>
      prevIds.includes(productId)
        ? prevIds.filter((id) => id !== productId)
        : [...prevIds, productId]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedProducts.length === currentItems.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentItems.map((product) => product.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length > 0) {
      setProductToDelete(selectedProducts);
      setModalIsOpen(true);
      setIsBulkDelete(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        productToDelete.map((productId) =>
          axios.delete(`${backendUrl}api/products/${productId}`)
        )
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => !productToDelete.includes(product.id))
      );
      setSelectedProducts([]);
      closeModal();
      toast.success("Product or Products deleted successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting Products:", error);
      toast.error("Error deleting Products:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key) {
      sortableProducts.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key.startsWith("variants.")) {
          const variantKey = sortConfig.key.split(".")[1];
          aValue = Math.min(
            ...a.variants.map((variant) => parseFloat(variant[variantKey] || 0))
          );
          bValue = Math.min(
            ...b.variants.map((variant) => parseFloat(variant[variantKey] || 0))
          );
        } else {
          aValue = getNestedValue(a, sortConfig.key);
          bValue = getNestedValue(b, sortConfig.key);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

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
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
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
      <h2 className="text-lg font-medium text-gray-800">Products Details</h2>
      <div className="flex items-center justify-end gap-x-3 mt-6">
        {selectedProducts.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center justify-center h-12 w-12 px-2 text-white bg-red-600 rounded-full hover:bg-red-500 focus:outline-none"
          >
            <FaRegTrashCan size={24} />
          </button>
        )}
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center h-12 w-12 px-2 text-white bg-blue-400 rounded-full hover:bg-blue-500 focus:outline-none"
        >
          <FaPlus size={24} />
        </button>
      </div>
      {showEditProductModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <EditProductForm
              onClose={closeAddModal}
              refreshProducts={fetchProducts}
              initialData={editingProduct}
              isEditMode={!!editingProduct}
            />
          </div>
        </div>
      )}
      {showEditVariantModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <EditVariantForm
              onClose={closeEditVariantModal}
              refreshVariants={fetchProducts}
              initialData={editingVariant}
              isEditMode={!!editingVariant}
              product={editingProductForVariant}
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
                    className="text-blue-500 bproduct-gray-300 rounded"
                    onChange={handleSelectAllChange}
                    checked={selectedProducts.length === currentItems.length}
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Product Name
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("product_type")}
                >
                  Category
                  {sortConfig.key === "product_type" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("variants.price")}
                >
                  Price
                  {sortConfig.key === "variants.price" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("variants.inventory_quantity")}
                >
                  Inventory Stock
                  {sortConfig.key === "variants.inventory_quantity" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("variants.inventory_quantity")}
                >
                  Vendor
                  {sortConfig.key === "variants.inventory_quantity" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
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
              {currentItems.map((product) => (
                <React.Fragment key={product.id}>
                  <tr>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="text-blue-500 mr-4 border-gray-300 rounded"
                        onChange={() => handleProductCheckboxChange(product.id)}
                        checked={selectedProducts.includes(product.id)}
                      />
                      <button
                        onClick={() => handleToggleVariantExpansion(product.id)}
                        className="text-gray-800 transition-colors duration-200 m-auto hover:text-gray-500 focus:outline-none"
                      >
                        {product.variants.length > 1 && (
                          <FaChevronDown
                            size={16}
                            className={
                              expandedProductIds.includes(product.id)
                                ? "transform rotate-180 text-gray-800"
                                : "text-gray-800"
                            }
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 whitespace-nowrap">
                      {" "}
                      <div className="flex items-center gap-x-1">
                        {" "}
                        <img
                          className="object-cover w-12 h-12 rounded-full"
                          src={product.image?.src}
                          alt={product.image?.alt}
                        />
                        <div>
                          <h2 className="font-medium text-gray-800">
                            {product.title}
                          </h2>
                          {/* <p className="text-sm font-normal text-gray-800">
                              {product.handle}
                            </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {product.product_type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {product.variants[0]?.price}{" "}
                      {/* Show first variant price */}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {product.variants[0]?.inventory_quantity}{" "}
                      {/* Show first variant inventory */}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {product.vendor} {/* Show first variant inventory */}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
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
                        <span
                          className={`text-sm font-normal ${
                            product.status === "active"
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-6">
                        <div className="h-auto w-auto">
                          <button
                            className="text-gray-800 transition-colors duration-200 hover:text-green-500 focus:outline-none"
                            onClick={() => handleAddVariant(product)}
                          >
                            <FaPlus size={18} />
                          </button>
                        </div>
                        <div className="h-auto w-auto">
                          <button
                            className="text-gray-800 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                            onClick={() => openModal(product.id)}
                          >
                            <FaRegTrashCan size={22} />
                          </button>
                        </div>
                        <div className="h-auto w-auto">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-800 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                          >
                            <FaRegEdit size={22} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedProductIds.includes(product.id) &&
                    product.variants.map((variant, index) => (
                      <tr
                        key={`${product.id}-${index}`}
                        className="border-t border-gray-200"
                      >
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap"></td>
                        <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {/* Name */}
                          <div>
                            <span className="font-medium">
                              {variant.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {/* Category (Leave Empty) */}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {/* Price */}
                          {variant.price}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {/* Inventory Stock */}
                          {variant.inventory_quantity}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {/* Status (Leave Empty) */}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {/* Status (Leave Empty) */}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {/* Edit and Delete Buttons */}
                          <div className="flex items-center gap-x-6">
                            <div className="h-auto w-auto flex justify-center items-center">
                              <button
                                className="text-gray-800 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                                onClick={() =>
                                  openVariantModal(product.id, variant.id)
                                }
                              >
                                <FaRegTrashCan size={18} />
                              </button>
                            </div>
                            <div className="h-auto w-auto flex justify-center items-center">
                              <button
                                className="text-gray-800 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                                onClick={() =>
                                  handleEditVariant(product, variant)
                                }
                              >
                                <FaRegEdit size={18} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white bproduct rounded-md gap-x-2 hover:bg-gray-100 ${
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
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white bproduct rounded-md gap-x-2 hover:bg-gray-100 ${
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
        onConfirm={
          isBulkDelete
            ? handleConfirmBulkDelete
            : isVariantDelete
            ? handleDeleteVariant
            : handleDeleteProduct
        }
        isLoading={isLoading}
        isBulkDelete={isBulkDelete}
      />
    </section>
  );
}

export default Products;
