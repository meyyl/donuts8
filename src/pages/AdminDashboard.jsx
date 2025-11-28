import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (error) console.error(error);
    else setProducts(data);
  };

  // 🔹 Upload gambar ke Supabase Storage
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Gagal upload gambar.");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  };

  // 🔹 Tambah produk
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) imageUrl = await uploadImage(imageFile);

    const { error } = await supabase.from("products").insert([
      { name, price, image_url: imageUrl },
    ]);

    setLoading(false);

    if (error) alert("Gagal menambahkan produk: " + error.message);
    else {
      alert("Produk berhasil ditambahkan!");
      setName("");
      setPrice("");
      setImageFile(null);
      fetchProducts();
    }
  };

  // 🔹 Hapus produk
  const deleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert("Gagal menghapus produk.");
    else fetchProducts();
  };

  // 🔹 Edit produk
  const startEditing = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setImageFile(null);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = editingProduct.image_url;
    if (imageFile) imageUrl = await uploadImage(imageFile);

    const { error } = await supabase
      .from("products")
      .update({ name, price, image_url: imageUrl })
      .eq("id", editingProduct.id);

    setLoading(false);

    if (error) alert("Gagal memperbarui produk: " + error.message);
    else {
      alert("Produk berhasil diperbarui!");
      cancelEditing();
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b2215] via-[#5a3520] to-[#7a4b28] text-white p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center mb-10 text-yellow-300 drop-shadow-lg"
      >
        Admin Dashboard
      </motion.h1>

      {/* FORM TAMBAH / EDIT PRODUK */}
      <motion.form
        onSubmit={editingProduct ? updateProduct : addProduct}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#4b2a16]/80 backdrop-blur-md p-8 rounded-3xl w-full max-w-lg mx-auto mb-10 border border-yellow-300/40 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-yellow-300 text-center mb-6">
          {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>

        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#3b2215] border border-yellow-300 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none"
          required
        />
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#3b2215] border border-yellow-300 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none"
          required
        />

        <label className="block text-sm text-yellow-300 mb-2">
          Pilih Gambar Produk
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-4 file:rounded-lg file:bg-yellow-400 file:text-[#3b2215] file:font-semibold file:px-3 file:py-2 hover:file:bg-yellow-500"
        />

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #facc15" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-[#3b2215] font-bold py-3 rounded-full transition"
          >
            {loading
              ? "Menyimpan..."
              : editingProduct
              ? "Simpan Perubahan"
              : "Tambah Produk"}
          </motion.button>

          {editingProduct && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={cancelEditing}
              type="button"
              className="w-1/3 bg-red-500 text-white font-semibold py-3 rounded-full hover:bg-red-600 transition"
            >
              <FaTimes className="inline mr-2" /> Batal
            </motion.button>
          )}
        </div>
      </motion.form>

      {/* DAFTAR PRODUK */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            className="bg-[#4b2a16]/80 p-5 rounded-3xl shadow-lg border border-yellow-300/30 text-center relative"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-56 object-cover rounded-2xl mb-4 border border-yellow-300/20 shadow-md"
              />
            ) : (
              <div className="w-full h-56 bg-[#3b2215] flex items-center justify-center rounded-2xl text-yellow-200 italic">
                Tidak ada gambar
              </div>
            )}
            <h3 className="text-xl font-semibold text-yellow-300 mb-1">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-yellow-200 mb-3">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => startEditing(product)}
                className="bg-yellow-400 text-[#3b2215] px-3 py-2 rounded-full hover:bg-yellow-500 transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 px-3 py-2 rounded-full hover:bg-red-600 transition"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
