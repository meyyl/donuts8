import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchProducts();
  }, []);

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error("Error fetching user:", error.message);
    setUser(data?.user || null);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        created_at,
        reviews(rating)
      `);

    if (error) {
      console.error("Error fetching products:", error.message);
      return;
    }

    const productsWithRating = data.map((p) => {
      const avgRating =
        p.reviews && p.reviews.length > 0
          ? (
              p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
            ).toFixed(1)
          : 0;
      return { ...p, avgRating };
    });

    setProducts(productsWithRating);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menambah ke keranjang!");
      return;
    }

    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (error) console.error("Error update cart:", error.message);
      else alert("Jumlah produk di keranjang diperbarui 🛒");
    } else {
      const { error } = await supabase.from("cart_items").insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        },
      ]);

      if (error) console.error("Error add to cart:", error.message);
      else alert("Produk ditambahkan ke keranjang 🛍️");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3e8d6] via-[#e4d2b8] to-[#c4a889] px-6 py-20">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#3b2215] tracking-wide drop-shadow">
          🍩 Produk Premium Kami
        </h1>

        <button
          onClick={() => navigate("/cart")}
          className="flex items-center bg-[#d6a354] hover:bg-[#e4b568] text-[#3b2215] px-5 py-2.5 rounded-full font-semibold shadow-md transition"
        >
          <FaShoppingCart className="mr-2" />
          Keranjang
        </button>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md border border-[#e5d5b8] p-4 hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* Gambar */}
              <div className="relative">
                <img
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="absolute top-2 right-2 bg-[#d6a354] hover:bg-[#e6b868] p-2 rounded-full shadow-md transition"
                >
                  <FaShoppingCart className="text-white text-sm" />
                </button>
              </div>

              {/* Nama */}
              <h2 className="text-lg font-semibold mt-4 text-[#3b2215] line-clamp-2 min-h-[52px]">
                {product.name}
              </h2>

              {/* Deskripsi */}
              <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                {product.description || "Tidak ada deskripsi"}
              </p>

              {/* Harga */}
              <p className="text-xl font-extrabold text-[#b8743f] mt-3">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>

              {/* Rating */}
              <div className="flex items-center text-sm mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.round(product.avgRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } text-sm`}
                  />
                ))}
                <span className="ml-1 text-gray-700 text-xs">
                  ({product.avgRating})
                </span>
              </div>

              {/* Tombol Detail */}
              <Link
                to={`/product/${product.id}`}
                className="block text-center w-full mt-4 bg-[#d6a354] hover:bg-[#e6b868] text-white py-2 rounded-lg font-semibold shadow transition"
              >
                Detail Produk
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 col-span-full">
            Produk sedang tidak tersedia.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
