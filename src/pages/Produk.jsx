import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext"; // 🔹 Context untuk keranjang
import { FaShoppingCart } from "react-icons/fa"; // 🔹 Icon keranjang
import { useNavigate } from "react-router-dom";

const Produk = () => {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext); // 🔹 Fungsi tambah ke keranjang
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-[#3b2215] via-[#5a3520] to-[#7a4b28] min-h-screen py-12 px-6 text-yellow-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-yellow-200 tracking-wider">
        Kelola Produk
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-[#ffffff]/10 border border-yellow-400/40 rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={p.image.startsWith("http") ? p.image : `http://localhost:5000${p.image}`}
              alt={p.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-yellow-300">{p.name}</h3>
              <p className="text-sm text-yellow-100 mt-1">{p.description}</p>
              <p className="mt-2 text-yellow-200">Harga: Rp{p.price}</p>
              <p className="text-yellow-200">Stok: {p.stock}</p>

              <div className="mt-4 flex justify-between items-center">
                {/* Button lihat detail */}
                <button
                  onClick={() => alert(`Produk: ${p.name}\n${p.description}\nHarga: Rp${p.price}`)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Lihat Detail
                </button>

                {/* Icon keranjang */}
                <button
                  onClick={() => {
                    addToCart(p); // 🔹 Tambah produk ke keranjang
                    navigate("/cart"); // 🔹 Pindah ke halaman keranjang
                  }}
                  className="p-2 bg-yellow-400 text-[#3b2215] rounded-full hover:bg-yellow-300"
                  title="Tambah ke Keranjang"
                >
                  <FaShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Produk;
