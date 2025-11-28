// Ultra-modern bright premium checkout UI
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
    note: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return alert("Harus login dulu!");

    const { data: newOrder, error: errOrder } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          fullname: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          payment_method: formData.paymentMethod,
          note: formData.note,
          total_price: total,
          status:
            formData.paymentMethod === "cod"
              ? "proses"
              : "menunggu pembayaran"
        }
      ])
      .select()
      .single();

    if (errOrder) {
      console.error(errOrder);
      return alert("Gagal membuat pesanan!");
    }

    const orderId = newOrder.id;

    await supabase.from("order_items").insert(
      cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.quantity * item.product.price
      }))
    );

    await supabase.from("cart_items").delete().eq("user_id", user.id);

    if (formData.paymentMethod === "cod") {
      navigate("/success", { state: { orderId } });
    } else {
      navigate("/payment-confirmation", {
        state: {
          orderId,
          paymentMethod: formData.paymentMethod,
          amount: total
        }
      });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-white text-[#3b2215] py-12 px-6 pt-28 flex justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-amber-300/40 relative overflow-hidden">

        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>

        <h1 className="text-5xl font-extrabold text-amber-700 text-center mb-10 tracking-wide drop-shadow-sm">
          Checkout
        </h1>

        {/* Cart Items Card */}
        <div className="space-y-4 mb-10">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-amber-200 hover:shadow-xl transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image_url}
                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                />
                <div>
                  <p className="font-semibold text-lg">{item.product.name}</p>
                  <p className="text-sm text-amber-700/70">Jumlah: {item.quantity}</p>
                </div>
              </div>
              <p className="text-amber-800 font-bold text-xl">
                Rp {(item.quantity * item.product.price).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-right text-4xl font-extrabold text-amber-900 mb-10">
          Total: Rp {total.toLocaleString("id-ID")}
        </div>

        {/* Form Card */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Nomor Telepon"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
          />

          <textarea
            name="address"
            placeholder="Alamat Lengkap"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
          ></textarea>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="Kota"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Kode Pos"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
          >
            <option value="cod">COD (Bayar ditempat)</option>
            <option value="transfer">Transfer Bank</option>
            <option value="e-wallet">E-Wallet (Dana/Gopay/OVO)</option>
          </select>

          <textarea
            name="note"
            placeholder="Catatan tambahan (optional)"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition text-white py-4 font-bold text-xl rounded-2xl shadow-xl"
          >
            Konfirmasi Pembayaran
          </button>
        </form>
      </div>
    </section>
  );
}