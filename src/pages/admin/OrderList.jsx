import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        fullname,
        total_price,
        status,
        created_at,
        order_items (
          product_id,
          quantity,
          subtotal,
          products:product_id (
            name,
            price
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    else console.error(error);

    setLoading(false);
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-200 text-yellow-800";
      case "paid": return "bg-green-200 text-green-800";
      case "cancelled": return "bg-red-200 text-red-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="bg-[#fff8f0] p-6 rounded-2xl shadow-lg border border-[#f3e0c8]">
      <h2 className="text-2xl font-bold mb-5 text-[#3b2215]">🛒 Daftar Pesanan</h2>

      {loading ? (
        <p>Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <p>Belum ada pesanan dari user.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#f0d9c2] shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fcead8] text-left text-[#3b2215]">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Produk</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#fff3e6] transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-3 border text-sm font-medium">{order.id}</td>
                  <td className="p-3 border">{order.fullname}</td>

                  <td className="p-3 border">
                    <ul className="list-disc pl-4">
                      {order.order_items.map((item) => (
                        <li key={item.product_id}>
                          {item.products.name} — {item.quantity}x
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="p-3 border font-bold text-[#3b2215]">
                    Rp {order.total_price.toLocaleString("id-ID")}
                  </td>

                  <td className="p-3 border">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 border">
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl border border-[#f1d9c4]">
            <h3 className="text-xl font-bold text-[#3b2215] mb-4">
              Detail Pesanan #{selectedOrder.id}
            </h3>

            <div className="space-y-2 text-sm">
              <p><b>Pelanggan:</b> {selectedOrder.fullname}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
              <p><b>Tanggal:</b> {new Date(selectedOrder.created_at).toLocaleString("id-ID")}</p>
            </div>

            <h4 className="mt-4 mb-2 font-semibold text-[#3b2215]">Produk Dibeli:</h4>
            <div className="border rounded-xl p-3 bg-[#fff8f0]">
              {selectedOrder.order_items.map((item) => (
                <div key={item.product_id} className="py-2 border-b last:border-none">
                  <b>{item.products.name}</b><br />
                  {item.quantity} × Rp {item.products.price.toLocaleString("id-ID")}
                  <div className="text-xs text-gray-600">
                    Subtotal: Rp {item.subtotal.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xl font-bold text-[#3b2215]">
              Total: Rp {selectedOrder.total_price.toLocaleString("id-ID")}
            </p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 w-full bg-[#f7d19a] hover:bg-[#e8c288] transition text-[#3b2215] font-bold py-2 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
