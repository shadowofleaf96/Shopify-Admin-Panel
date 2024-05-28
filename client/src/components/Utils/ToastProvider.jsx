import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        toastId="toast"
        transition={Slide}
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        limit={1}
      />
    </>
  );
};

export default ToastProvider;
