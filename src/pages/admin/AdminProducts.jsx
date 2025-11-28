import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

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
      await supabase.from("products").update(payload).eq("id", editingProduct.id);
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
    <div className="p-8 bg-[#f5e7d6] min-h-screen">
      <h2 className="text-3xl font-extrabold text-[#3b2215] mb-6 drop-shadow">
        🍩 Manajemen Produk
      </h2>

      <button
        onClick={() => {
          setEditingProduct(null);
          setForm({ name: "", description: "", price: "", imageFile: null });
          setShowModal(true);
        }}
        className="mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#3b2215] px-6 py-2 rounded-full font-semibold shadow 
        hover:brightness-110 transition"
      >
        + Tambah Produk
      </button>

      <div className="overflow-hidden border border-[#d8c3ac] rounded-xl shadow-lg">
        <table className="w-full text-sm bg-white">
          <thead className="bg-[#f8e9c6] text-[#3b2215] font-semibold">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Gambar</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Deskripsi</th>
              <th className="p-3 border">Harga</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#fff7e6] transition border-b"
                >
                  <td className="p-3 text-center">{p.id}</td>
                  <td className="p-3 text-center">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        className="w-14 h-14 object-cover rounded-lg mx-auto shadow"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 text-gray-600">
                    {p.description?.slice(0, 50)}...
                  </td>
                  <td className="p-3 font-semibold text-[#3b2215]">
                    Rp {Number(p.price).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full shadow hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative border border-yellow-300/40">

            <h3 className="text-xl font-bold text-[#3b2215] mb-4">
              {editingProduct ? "Edit Produk" : "Tambah Produk"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama produk"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />

              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded-lg"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-[#3b2215] font-semibold shadow"
                >
                  Simpan
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 text-2xl hover:text-gray-900"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
