import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      setOrder(orderData);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("*, products(name)")
        .eq("order_id", orderId);

      setItems(itemData || []);
    };

    fetchOrder();
  }, [orderId]);

  const printReceipt = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center text-[#3a2a1f] text-xl">
        Memuat...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f5f0] text-[#3a2a1f] py-20 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-[#e8dfd6] print:shadow-none print:border-none"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold text-center mb-4 text-[#c78b36]"
        >
          Pembayaran Berhasil!
        </motion.h1>

        <p className="text-center text-lg text-[#6d5b4c] mb-8">
          Terima kasih telah melakukan pemesanan.
        </p>

        {/* Info Pesanan */}
        <div className="bg-[#fff7ea] p-5 rounded-2xl border border-[#ead9c5] mb-8 print:bg-white">
          <p className="text-[#8a7664]">Nomor Pesanan:</p>
          <p className="font-bold text-[#c78b36] text-xl">{order.id}</p>

          <p className="text-[#8a7664] mt-3">Waktu:</p>
          <p className="font-semibold">
            {new Date(order.created_at).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Detail Item */}
        <h2 className="text-2xl font-bold text-[#c78b36] mb-3">Detail Pesanan</h2>

        <div className="bg-[#fff7ea] rounded-2xl p-5 border border-[#ead9c5] print:bg-white">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-[#e3d6c8] py-3"
            >
              <div>
                <p className="font-semibold text-[#3a2a1f]">{item.products.name}</p>
                <p className="text-sm text-[#8a7664]">
                  {item.quantity}× Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="font-bold text-[#c78b36]">
                Rp {(item.quantity * item.price).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-[#fff7ea] mt-8 p-5 rounded-2xl border border-[#ead9c5] text-center print:bg-white">
          <p className="text-lg text-[#8a7664]">Total Pembayaran:</p>
          <p className="text-4xl font-extrabold text-[#c78b36] mt-1">
            Rp {order.total_price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Tombol */}
        <div className="mt-10 flex gap-4 print:hidden">
          <button
            onClick={printReceipt}
            className="w-1/2 bg-[#cfa058] text-white py-3 rounded-xl font-bold hover:bg-[#d7a866] transition shadow-md"
          >
            Cetak Struk
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-1/2 bg-gray-300 text-[#3a2a1f] py-3 rounded-xl font-bold hover:bg-gray-400 transition shadow-md"
          >
            Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    </section>
  );
}
