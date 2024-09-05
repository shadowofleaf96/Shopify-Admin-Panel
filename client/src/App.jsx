import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { FaSpinner } from "react-icons/fa6";

const Login = lazy(() => import("./pages/LoginPage"));
const Layout = lazy(() => import("./pages/LayoutPage"));
const Dashboard = lazy(() => import("./pages/DashboardPage"));
const Users = lazy(() => import("./pages/UsersPage"));
const Orders = lazy(() => import("./pages/OrdersPage"));
const NotFound = lazy(() => import("./components/Error/NotFound"));
const Products = lazy(() => import("./pages/ProductsPage"));
const ProtectedRoute = lazy(() => import("./components/Utils/ProtectedRoute"));

function App() {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <FaSpinner size={40} className="animate-spin text-blue-500" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </UserProvider>
  );
}

export default App;
