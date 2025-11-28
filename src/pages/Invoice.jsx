import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        fullname,
        phone,
        address,
        city,
        postal_code,
        payment_method,
        total_price,
        status,
        created_at,
        order_items (
          id,
          quantity,
          price,
          subtotal,
          product:product_id (
            id,
            name,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single();

    if (!error) setOrder(data);
  };

  if (!order)
    return (
      <div className="text-center text-white">Memuat data struk...</div>
    );

  return (
    <div className="min-h-screen bg-[#3b2215] text-white p-6 pt-24">
      <div className="max-w-3xl mx-auto bg-[#4b2a16] p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-yellow-300 text-center mb-6">
          🧾 Struk Pesanan
        </h1>

        <div className="mb-4">
          <p><strong>Nama:</strong> {order.fullname}</p>
          <p><strong>No HP:</strong> {order.phone}</p>
          <p><strong>Alamat:</strong> {order.address}</p>
          <p><strong>Kota:</strong> {order.city}</p>
          <p><strong>Kode Pos:</strong> {order.postal_code}</p>
        </div>

        <hr className="border-yellow-400 my-4" />

        <h2 className="text-xl font-semibold mb-3">Produk Dibeli:</h2>

        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>
              Rp {Number(item.subtotal).toLocaleString("id-ID")}
            </span>
          </div>
        ))}

        <hr className="border-yellow-400 my-4" />

        <div className="text-right text-2xl font-bold text-yellow-400">
          Total : Rp {Number(order.total_price).toLocaleString("id-ID")}
        </div>

        <p className="text-center text-gray-300 mt-6">
          Terima kasih telah berbelanja di Crave Donuts 🍩
        </p>
      </div>
    </div>
  );
};

export default Invoice;
