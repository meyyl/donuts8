import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#2e1a0f] text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-300">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <ProductForm onSuccess={fetchProducts} />

      <h2 className="text-2xl mt-10 mb-4">Daftar Produk</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white/10 p-4 rounded-xl shadow-md border border-yellow-200/20"
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-yellow-300">{p.name}</h3>
            <p className="text-sm text-yellow-100 mt-1">{p.description}</p>
            <p className="mt-2 text-yellow-200 font-semibold">
              Rp {p.price.toLocaleString()}
            </p>
            <p className="text-sm text-yellow-100">Stok: {p.stock}</p>
            <div className="flex justify-end mt-3 space-x-2">
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
