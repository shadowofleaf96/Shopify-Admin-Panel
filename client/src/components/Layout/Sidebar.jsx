import React from "react";
import { FaBoxOpen, FaHome, FaUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const SideElements = [
    {
      name: "Dashboard",
      href: `/`,
      current: pathname === `/`,
      icon: <FaHome size={24} className="text-blue-500" />,
    },
    {
      name: "Users",
      href: `/users/`,
      current: pathname === `/users/`,
      icon: <FaUser size={24} className="text-blue-500" />,
    },
    {
      name: "Products",
      href: `/products/`,
      current: pathname === `/products/`,
      icon: <FaBoxOpen size={24} className="text-blue-500" />,
    },
    {
      name: "Orders",
      href: `/orders/`,
      current: pathname === `/orders/`,
      icon: <FaCartShopping size={24} className="text-blue-500" />,
    },
  ];

  return (
    <aside className="w-48 h-full bg-white border-r flex flex-col px-5 py-4 overflow-y-auto">
      <div className="flex flex-col justify-between flex-1 mt-6">
        <section className="space-y-6">
          <div className="space-y-3">
            {SideElements.map((item) => (
              <Link
                key={item.name}
                className={`flex items-center px-3 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700 ${
                  item.current ? "bg-gray-100 text-gray-700" : ""
                }`}
                to={item.href}
              >
                {item.icon}
                <span className="ml-2 text-md font-medium text-gray-700">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;
