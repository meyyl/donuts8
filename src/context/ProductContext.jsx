import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // 🔹 Ambil data produk dari backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Tambah produk
  const addProduct = async (formData) => {
    await axios.post("http://localhost:5000/api/products", formData);
    fetchProducts(); // refresh data
  };

  // 🔹 Update produk
  const updateProduct = async (id, formData) => {
    await axios.put(`http://localhost:5000/api/products/${id}`, formData);
    fetchProducts();
  };

  // 🔹 Hapus produk
  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
