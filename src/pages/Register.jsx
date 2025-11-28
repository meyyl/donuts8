import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [sparkles, setSparkles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const newSparkles = Array.from({ length: 35 }).map(() => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
    }));
    setSparkles(newSparkles);

    // Parallax Effect
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / 50, y: e.clientY / 50 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    const user = data.user;

    await supabase.from("profiles").insert([
      {
        id: user.id,
        full_name: fullName,
        role: "user",
      },
    ]);

    alert("Registrasi berhasil! Silakan login");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7e7c9] via-[#ffe6b3] to-[#ffd48a] overflow-hidden">

      {/* Sparkle */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 1, 0.2],
            y: [sp.y, sp.y - 40, sp.y],
          }}
          transition={{
            duration: sp.duration,
            delay: sp.delay,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute bg-yellow-500 rounded-full"
          style={{
            top: sp.y,
            left: sp.x,
            width: sp.size,
            height: sp.size,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Donuts with floating + wiggle + parallax */}
      <motion.img
        src="/donuts-choco.png"
        className="absolute w-44 top-8 left-8 opacity-30 animate-spin-slow animate-float animate-wiggle"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />

      <motion.img
        src="/donuts-strawberry.png"
        className="absolute w-52 bottom-16 right-14 opacity-25 animate-spin-slow-reverse animate-float"
        style={{
          transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`
        }}
      />

      <motion.img
        src="/donuts-o.png"
        className="absolute w-32 top-1/3 right-1/4 opacity-20 animate-spin-slow animate-wiggle"
      />

      <motion.img
        src="/donuts-reveluv.png"
        className="absolute w-36 bottom-10 left-1/4 opacity-20 animate-spin-slow-reverse animate-float"
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/70 backdrop-blur-xl p-10 w-full max-w-md rounded-3xl shadow-2xl border border-yellow-400"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-[#3b2215] drop-shadow">
          Create Account 🍩
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.04 }}
            className="w-full p-3 rounded-xl bg-white text-[#3b2215] border border-yellow-400 placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <motion.input
            whileFocus={{ scale: 1.04 }}
            type="email"
            className="w-full p-3 rounded-xl bg-white text-[#3b2215] border border-yellow-400 placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <motion.input
            whileFocus={{ scale: 1.04 }}
            type="password"
            className="w-full p-3 rounded-xl bg-white text-[#3b2215] border border-yellow-400 placeholder-gray-500 outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-yellow-400 text-[#3b2215] font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-500"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center text-[#3b2215] mt-6">
          Sudah punya akun?{" "}
          <Link className="text-yellow-600 font-semibold hover:underline" to="/login">
            Login di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
