import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_price,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price,
          subtotal,
          products (name, image_url)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-2xl text-gray-700">
        Loading riwayat pesanan...
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center text-2xl text-gray-700">
        Kamu belum pernah membuat pesanan.
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf7f2] text-gray-800 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-yellow-700 mb-10 drop-shadow-sm">
        🧾 Riwayat Pesanan
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-7 rounded-3xl shadow-xl border border-yellow-200"
          >
            {/* Header Order */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-lg font-semibold text-gray-600">
                🗓️ {new Date(order.created_at).toLocaleString("id-ID")}
              </p>
              <p className="text-yellow-700 font-bold text-2xl">
                Rp {Number(order.total_price).toLocaleString("id-ID")}
              </p>
            </div>

            {/* Item List */}
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-[#fff8e7] border border-yellow-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 rounded-xl object-cover border border-yellow-300"
                    />

                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {item.products.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Jumlah: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="text-yellow-700 font-bold text-lg">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
