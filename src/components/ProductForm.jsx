import React, { useState } from "react";
import { api } from "../api/api";

export default function ProductForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    setForm({ name: "", description: "", price: "", stock: "", image: "" });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl mb-4 font-bold text-yellow-300">Tambah Produk</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Nama Produk"
          value={form.name}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/20 text-white"
          required
        />
        <input
          name="price"
          placeholder="Harga"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/20 text-white"
          required
        />
        <input
          name="stock"
          placeholder="Stok"
          type="number"
          value={form.stock}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/20 text-white"
        />
        <input
          name="image"
          placeholder="URL Gambar"
          value={form.image}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/20 text-white"
        />
        <textarea
          name="description"
          placeholder="Deskripsi Produk"
          value={form.description}
          onChange={handleChange}
          className="col-span-2 p-3 rounded-lg bg-white/20 text-white"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-[#2e1a0f] font-bold py-2 px-6 rounded-lg"
      >
        Simpan
      </button>
    </form>
  );
}
