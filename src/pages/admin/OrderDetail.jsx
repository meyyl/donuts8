import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);

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
        note,
        total_price,
        status,
        created_at,
        order_items (
          quantity,
          subtotal,
          products ( name, price )
        )
      `)
      .eq("id", id)
      .single();

    if (!error) setOrder(data);

    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    fetchOrder(); // refresh data
    alert("Status pesanan diperbarui!");
  };

  if (loading) return <p>Memuat...</p>;
  if (!order) return <p>Pesanan tidak ditemukan.</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Detail Pesanan #{order.id}</h2>

      <div className="mb-6">
        <p><b>Nama:</b> {order.fullname}</p>
        <p><b>Telepon:</b> {order.phone}</p>
        <p><b>Alamat:</b> {order.address}, {order.city} {order.postal_code}</p>
        <p><b>Metode Pembayaran:</b> {order.payment_method}</p>
        <p><b>Catatan:</b> {order.note || "-"}</p>
        <p><b>Tanggal:</b> {new Date(order.created_at).toLocaleString("id-ID")}</p>
      </div>

      <h3 className="text-xl font-semibold mb-3">Produk</h3>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{item.products?.name}</td>
              <td className="p-2 border">
                Rp {item.products.price.toLocaleString("id-ID")}
              </td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right text-xl font-bold">
        Total: Rp {order.total_price.toLocaleString("id-ID")}
      </p>

      {/* BUTTON UPDATE STATUS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => updateStatus("pending")}
          className="bg-yellow-400 px-4 py-2 rounded-lg"
        >
          Pending
        </button>

        <button
          onClick={() => updateStatus("paid")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Tandai Sudah Dibayar
        </button>

        <button
          onClick={() => updateStatus("cancelled")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Batalkan Pesanan
        </button>
      </div>
    </div>
  );
}
