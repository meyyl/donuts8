import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const u = userData?.user;
    setUser(u);

    if (u) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", u.id)
        .single();
      setProfile(prof);

      const { data: orderHistory } = await supabase
        .from("orders")
        .select(`
          id,
          total_price,
          status,
          created_at,
          order_items (
            product_id,
            quantity,
            subtotal,
            products ( name, price )
          )
        `)
        .eq("user_id", u.id)
        .order("created_at", { ascending: false });

      setOrders(orderHistory || []);
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "proses":
        return "bg-yellow-300 text-[#3b2215]";
      case "menunggu pembayaran":
        return "bg-blue-500 text-white";
      case "selesai":
        return "bg-green-600 text-white";
      case "batal":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3b2215] text-xl">
        Memuat data...
      </div>
    );
  }

  const avatarText = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#FFF8E8] pt-24 px-6">

      {/* HERO */}
      <div className="text-center mb-10">
        <div className="w-28 h-28 mx-auto rounded-full bg-[#4a2a18] text-yellow-300 flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-yellow-300">
          {avatarText}
        </div>
        <h1 className="text-4xl font-bold text-[#3b2215] mt-4 drop-shadow">
          Halo, {profile?.full_name}!
        </h1>
        <p className="text-[#5a3c2c] mt-1">Selamat datang di halaman profilmu</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-12 border border-yellow-300/30">

        <h2 className="text-2xl font-bold text-[#3b2215] mb-4">
          📌 Informasi Akun
        </h2>

        <div className="space-y-3 text-lg">
          <p className="flex justify-between">
            <span className="font-semibold text-[#5a3c2c]">Nama</span>
            <span className="text-[#3b2215]">{profile?.full_name}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-[#5a3c2c]">Email</span>
            <span className="text-[#3b2215]">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-yellow-300/30 mb-10">
        <h2 className="text-2xl font-bold text-[#3b2215] mb-6">
          🧾 Riwayat Pesanan
        </h2>

        {orders.length === 0 ? (
          <p className="text-[#5a3c2c]">Belum ada pesanan yang dibuat.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FFF4DE] p-5 rounded-2xl border border-yellow-300/40 shadow"
              >
                <div className="flex justify-between mb-3">
                  <p className="font-semibold text-[#3b2215]">
                    Order #{order.id}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-[#5a3c2c]">
                  Tanggal:{" "}
                  {new Date(order.created_at).toLocaleDateString("id-ID")}
                </p>

                <h4 className="font-semibold mt-4 mb-2 text-[#3b2215]">
                  Produk Pesanan:
                </h4>

                <ul className="space-y-1 pl-5 text-[#5a3c2c]">
                  {order.order_items.map((item) => (
                    <li key={item.product_id}>
                      • {item.products.name} — {item.quantity}x  
                      (Rp {item.products.price.toLocaleString("id-ID")})
                    </li>
                  ))}
                </ul>

                <p className="mt-4 font-bold text-xl text-[#3b2215]">
                  Total: Rp {order.total_price.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
