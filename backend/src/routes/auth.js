import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const newUser = new User({
      name,
      username,
      email,
      password, // ❗ jangan di-hash di sini, karena sudah di-hash otomatis oleh model
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat registrasi" });
  }
});

// 📌 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "7d" });

    res.json({
      token,
      user: { name: user.name, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login gagal" });
  }
});

export default router;
