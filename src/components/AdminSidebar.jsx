// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaShoppingCart } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="bg-[#3b2215] w-64 h-screen fixed top-0 left-0 flex flex-col shadow-lg border-r border-yellow-300/30 z-[60]">
      <div className="p-6 text-center border-b border-yellow-300/30">
        <h1 className="text-2xl font-extrabold text-yellow-300">CraveDonut</h1>
        <p className="text-sm text-yellow-100">Admin Panel</p>
      </div>

      <nav className="flex-1 flex flex-col mt-6 space-y-2 px-4 text-white">
        <NavLink
          to="/admin-dashboard/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-400/20 ${
              isActive ? "bg-yellow-400/30 text-yellow-300" : ""
            }`
          }
        >
          <FaBoxOpen /> Produk
        </NavLink>

        <NavLink
          to="/admin-dashboard/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-400/20 ${
              isActive ? "bg-yellow-400/30 text-yellow-300" : ""
            }`
          }
        >
          <FaUsers /> Pengguna
        </NavLink>

        <NavLink
          to="/admin-dashboard/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-400/20 ${
              isActive ? "bg-yellow-400/30 text-yellow-300" : ""
            }`
          }
        >
          <FaShoppingCart /> Pesanan
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
