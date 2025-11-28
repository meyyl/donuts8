import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUser(data.user);
      fetchCart(data.user.id);
    }
  };

  const fetchCart = async (userId) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product:product_id (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("user_id", userId);

    if (!error) setCartItems(data);
  };

  const removeItem = async (id) => {
    await supabase.from("cart_items").delete().eq("id", id);
    fetchCart(user.id);
    alert("Produk dihapus dari keranjang.");
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) {
      await supabase.from("cart_items").delete().eq("id", id);
      fetchCart(user.id);
      alert("Produk dihapus dari keranjang.");
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", id);

    if (!error) fetchCart(user.id);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen pt-28 px-6 py-10 bg-gradient-to-br from-[#fdf6e9] via-[#f7e9d3] to-[#f2d7b0]">

      <h1 className="text-center text-4xl font-extrabold text-[#3b2215] mb-10">
        🛒 Keranjang Kamu
      </h1>

      {cartItems.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-5">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white/90 backdrop-blur-lg border border-[#e8d5b7] shadow-lg rounded-2xl p-4 hover:shadow-xl transition"
            >
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl shadow"
              />

              <div className="ml-5 flex-1">
                <h2 className="text-xl font-semibold text-[#3b2215] mb-1">
                  {item.product.name}
                </h2>

                <p className="text-[#7a4b28] font-bold">
                  Rp {Number(item.product.price).toLocaleString("id-ID")}
                </p>

                <div className="flex items-center mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 bg-[#e3c089] text-[#3b2215] rounded-l-lg font-bold hover:bg-[#d9b276] transition"
                  >
                    −
                  </button>

                  <span className="px-5 py-1.5 bg-[#f6e4c7] text-[#3b2215] font-semibold border border-[#d9b276]">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 bg-[#e3c089] text-[#3b2215] rounded-r-lg font-bold hover:bg-[#d9b276] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tombol hapus */}
              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
              >
                Hapus
              </button>
            </div>
          ))}

          {/* TOTAL */}
          <div className="text-right mt-7">
            <p className="text-2xl font-bold text-[#3b2215]">
              Total:{" "}
              <span className="text-[#b8860b]">
                Rp {Number(total).toLocaleString("id-ID")}
              </span>
            </p>
          </div>

          {/* CHECKOUT */}
          <div className="text-right mt-4">
            <button
              onClick={() =>
                navigate("/checkout", { state: { cartItems, total } })
              }
              className="bg-[#d4a762] text-[#3b2215] px-7 py-3 rounded-full font-bold shadow-lg hover:bg-[#c79955] transition"
            >
              Lanjut ke Checkout →
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-[#6e4a2b] text-lg">
          Keranjang kamu masih kosong.
        </p>
      )}
    </div>
  );
};

export default Cart;
