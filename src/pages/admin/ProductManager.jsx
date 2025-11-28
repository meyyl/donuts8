import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setProducts(data);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let image_url = editingProduct?.image_url || null;

    if (form.imageFile) {
      const file = form.imageFile;
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      }
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      image_url,
    };

    if (editingProduct) {
      await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([payload]);
    }

    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", imageFile: null });
    fetchProducts();
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageFile: null,
    });
    setShowModal(true);
  };

  return (
    <div className="p-10 bg-gradient-to-b from-[#fffdf8] to-[#fff5e6] min-h-screen">

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-[#3b2215] mb-8 drop-shadow-sm"
      >
        🍩 Manajemen Produk
      </motion.h2>

      {/* Add Button */}
      <motion.button
        onClick={() => {
          setEditingProduct(null);
          setForm({ name: "", description: "", price: "", imageFile: null });
          setShowModal(true);
        }}
        whileHover={{ scale: 1.05 }}
        className="mb-8 bg-yellow-400 hover:bg-yellow-500 text-[#3b2215] px-6 py-3 rounded-full font-bold shadow-xl"
      >
        + Tambah Produk
      </motion.button>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-yellow-200">

        <table className="w-full text-sm">
          <thead className="bg-[#fff8d9] text-[#3b2215] font-semibold">
            <tr>
              <th className="p-3 border border-yellow-200">ID</th>
              <th className="p-3 border border-yellow-200">Gambar</th>
              <th className="p-3 border border-yellow-200">Nama</th>
              <th className="p-3 border border-yellow-200">Deskripsi</th>
              <th className="p-3 border border-yellow-200">Harga</th>
              <th className="p-3 border border-yellow-200">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-5 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <motion.tr
                  key={p.id}
                  whileHover={{ scale: 1.01 }}
                  className="transition border-b hover:bg-[#fff7e6]"
                >
                  <td className="p-3 text-center">{p.id}</td>

                  <td className="p-3 text-center">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        className="w-16 h-16 object-cover rounded-xl shadow-md mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3 font-semibold text-[#3b2215]">{p.name}</td>

                  <td className="p-3 text-gray-600">
                    {p.description?.slice(0, 50)}...
                  </td>

                  <td className="p-3 font-bold text-[#3b2215]">
                    Rp {Number(p.price).toLocaleString("id-ID")}
                  </td>

                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-full shadow hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-full shadow hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-96 p-7 relative border border-yellow-300"
          >
            <h3 className="text-2xl font-bold text-[#3b2215] mb-5">
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama produk"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-xl bg-[#fff9ef]"
              />

              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-3 rounded-xl bg-[#fff9ef]"
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="w-full border p-3 rounded-xl bg-[#fff9ef]"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-3 rounded-xl bg-[#fff9ef]"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3b2215] font-bold shadow"
                >
                  Simpan
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-gray-900"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
