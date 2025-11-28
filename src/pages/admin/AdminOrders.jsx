import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        total_price,
        status,
        created_at,
        profiles:user_id (email),
        order_items (
          id,
          quantity,
          subtotal,
          products (name, image_url)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setOrders(data);

    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) fetchOrders();
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading semua pesanan...
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#3b2215] text-white py-10 px-6">
      <h1 className="text-4xl font-bold text-yellow-300 text-center mb-10">
        📦 Admin — Semua Pesanan
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#4b2a16] p-6 rounded-3xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-lg">
                  🧑 Pemesan: {order.profiles.email}
                </p>
                <p className="text-sm text-gray-300">
                  Tanggal: {new Date(order.created_at).toLocaleString("id-ID")}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="bg-yellow-400 text-black px-3 py-2 rounded-lg font-bold"
              >
                <option value="proses">Proses</option>
                <option value="siap_kirim">Siap Kirim</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#5a3520] p-3 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.products.name}</p>
                      <p className="text-sm text-gray-300">
                        Jumlah: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-yellow-300 font-bold">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right mt-4 text-xl font-bold text-yellow-400">
              Total: Rp {Number(order.total_price).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
