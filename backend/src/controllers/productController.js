import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup storage untuk gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// 📌 CREATE
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const newProduct = await Product.create({ name, description, price, stock, image });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah produk", error });
  }
};

// 📌 READ (semua produk)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat produk", error });
  }
};

// 📌 READ (detail)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
  }
};

// 📌 UPDATE
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengedit produk", error });
  }
};

// 📌 DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.image) {
      const filePath = "." + product.image; // misal /uploads/xxx.jpg
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk", error });
  }
};
