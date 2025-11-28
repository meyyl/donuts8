import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sparkles, setSparkles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }).map(() => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
    }));
    setSparkles(newSparkles);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    const user = data.user;
    

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      alert("Login berhasil sebagai ADMIN");
      navigate("/admin-dashboard");
    } else {
      alert("Login berhasil sebagai USER");
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ffe1b5] via-[#ffe9c9] to-[#fff3df] overflow-hidden">

      {/* ✨ Sparkle Animation */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            y: [sp.y, sp.y - 40, sp.y],
          }}
          transition={{
            duration: sp.duration,
            delay: sp.delay,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute bg-yellow-400 rounded-full shadow-sm"
          style={{
            top: sp.y,
            left: sp.x,
            width: sp.size,
            height: sp.size,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* 🍩 Donuts Floating + Glow */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10"
      >
        <img
          src="/donuts-choco.png"
          className="w-40 opacity-20 drop-shadow-[0_0_15px_#f4d37b]"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 25, 0],
          rotate: [0, -360],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-16 right-14"
      >
        <img
          src="/donuts-strawberry.png"
          className="w-48 opacity-20 drop-shadow-[0_0_20px_#f8b4c7]"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-12 left-1/4"
      >
        <img
          src="/donuts-reveluv.png"
          className="w-36 opacity-25 drop-shadow-[0_0_18px_#ffedc2]"
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, -360],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute top-24 right-1/4"
      >
        <img
          src="/donuts-o.png"
          className="w-32 opacity-20 drop-shadow-[0_0_14px_#ffe7a1]"
        />
      </motion.div>

      {/* 🧁 Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-yellow-300/50"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-[#3b2215] drop-shadow">
          Welcome Back 🍩
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.04 }}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#fff2d6] border border-yellow-400 placeholder-gray-600 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <motion.input
            whileFocus={{ scale: 1.04 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-[#fff2d6] border border-yellow-400 placeholder-gray-600 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-yellow-400 text-[#3b2215] font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-500 transition"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-[#3b2215] mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-yellow-600 hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
