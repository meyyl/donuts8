import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, paymentMethod, amount } = location.state || {};

  const qrImage =
    paymentMethod === "e-wallet" ? "/qr-dana.jpg" : "/qr-dana.jpg";

  return (
    <section className="min-h-screen bg-[#f8f5f0] text-[#3a2a1f] flex justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-[#e8dfd6]"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#c78b36]">
          Konfirmasi Pembayaran
        </h1>
        <p className="text-center text-lg text-[#6d5b4c] mb-6">
          Silakan lakukan pembayaran menggunakan QR berikut:
        </p>

        {/* QR CODE */}
        <div className="flex justify-center">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={qrImage}
            className="w-72 h-auto rounded-2xl shadow-md bg-white p-3 border border-[#e3d6c8]"
            alt="QR Code"
          />
        </div>

        {/* INFO PANEL */}
        <div className="mt-8 bg-[#fff7ea] p-5 rounded-2xl border border-[#ead9c5] text-center shadow-sm">
          <p className="text-[#c78b36] text-lg font-semibold">
            Total Pembayaran
          </p>
          <p className="text-3xl font-extrabold text-[#3a2a1f] mt-1">
            Rp {amount?.toLocaleString("id-ID")}
          </p>

          <p className="text-[#8a7664] mt-3 text-sm">ID Pesanan</p>
          <p className="font-bold text-[#c78b36] text-xl">{orderId}</p>
        </div>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/success", { state: { orderId } })}
          className="mt-8 w-full bg-[#cfa058] py-3 font-bold text-white rounded-xl shadow hover:bg-[#d7a866] transition"
        >
          Saya Sudah Membayar
        </motion.button>

        <p className="text-center text-[#8a7664] text-xs mt-4">
          Setelah pembayaran berhasil, klik tombol di atas.
        </p>
      </motion.div>
    </section>
  );
}