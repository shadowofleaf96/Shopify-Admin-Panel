import React from "react";
import Modal from "react-modal";
import { FaSpinner } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(17, 24, 39, 0.5)",
    zIndex: 1000,
  },
};

Modal.setAppElement("#root");

const ConfirmationModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  isLoading,
  isBulkDelete,
  isVariantDelete,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel="Confirmation Modal"
  >
    <h2 className="text-lg font-medium text-gray-800">Delete Confirmation</h2>
    <p className="mt-4 text-sm text-gray-600">
      {isBulkDelete
        ? "Are you sure you want to delete the selected element or elements?"
        : isVariantDelete
        ? "Are you sure you want to delete this variant?"
        : "Are you sure you want to delete this element?"}
    </p>
    <div className="mt-6 flex justify-end gap-4">
      <button
        onClick={onRequestClose}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        disabled={isLoading}
      >
        {isLoading ? <FaSpinner className="animate-spin" /> : "Delete"}
      </button>
    </div>
  </Modal>
);

export default ConfirmationModal;
