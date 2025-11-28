import React, { useState } from "react";
import ProductManager from "./ProductManager";
import UserList from "./UserList";
import OrderList from "./OrderList";
import { motion } from "framer-motion";
import { Users, ShoppingCart, CupSoda } from "lucide-react";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("summary");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fff7ed] to-[#ffe8d6] overflow-hidden pt-28">
      {/* 🍩 Floating Background Donuts */}
      <motion.img
        src="/donuts-choco.png"
        className="absolute w-40 top-10 left-10 opacity-20"
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <motion.img
        src="/donuts-strawberry.png"
        className="absolute w-44 bottom-10 right-10 opacity-20"
        animate={{ y: [0, 15, 0], rotate: [0, -8, 8, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />

      <motion.img
        src="/donuts-reveluv.png"
        className="absolute w-28 top-1/3 right-1/4 opacity-20"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      {/* Judul Halaman */}
      {activePage === "summary" && (
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-[#3b2215] text-center pt-10 drop-shadow"
        >
          Admin Dashboard 🍩
        </motion.h1>
      )}

      {/* 📊 SUMMARY CARDS */}
      {activePage === "summary" && (
        <div className="pt-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Produk */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            onClick={() => setActivePage("produk")}
            className="cursor-pointer bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-[#eec99f] hover:shadow-xl transition"
          >
            <CupSoda size={45} className="text-[#3b2215]" />
            <h3 className="text-xl font-bold text-[#3b2215] mt-2">Kelola Produk</h3>
            <p className="text-[#66412a] text-sm mt-1">
              Tambah, edit, dan hapus produk.
            </p>
          </motion.div>

          {/* User */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            onClick={() => setActivePage("user")}
            className="cursor-pointer bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-[#eec99f] hover:shadow-xl transition"
          >
            <Users size={45} className="text-[#3b2215]" />
            <h3 className="text-xl font-bold text-[#3b2215] mt-2">User Terdaftar</h3>
            <p className="text-[#66412a] text-sm mt-1">
              Lihat semua user aktif.
            </p>
          </motion.div>

          {/* Pesanan */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            onClick={() => setActivePage("pesanan")}
            className="cursor-pointer bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-[#eec99f] hover:shadow-xl transition"
          >
            <ShoppingCart size={45} className="text-[#3b2215]" />
            <h3 className="text-xl font-bold text-[#3b2215] mt-2">Pesanan Masuk</h3>
            <p className="text-[#66412a] text-sm mt-1">
              Kelola pesanan pelanggan.
            </p>
          </motion.div>
        </div>
      )}

      {/* 🔙 Tombol kembali ke summary */}
      {activePage !== "summary" && (
        <div className="px-6 mt-6">
          <button
            onClick={() => setActivePage("summary")}
            className="bg-yellow-400 px-5 py-2 rounded-full shadow font-semibold text-[#3b2215] hover:bg-yellow-300 transition"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      )}

      {/* 📂 HALAMAN KONTEN */}
      <div className="mt-6 px-4 max-w-6xl mx-auto pb-20">
        {activePage === "produk" && <ProductManager />}
        {activePage === "user" && <UserList />}
        {activePage === "pesanan" && <OrderList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
