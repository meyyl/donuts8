import React from "react";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div
      id="contact"
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/donuts.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff8f0dd] via-[#f5e8d9dd] to-[#eedfccdd] backdrop-blur-sm"></div>

      {/* Sparkle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-50 blur-[1px]"
            initial={{
              x: Math.random() * 1200 - 600,
              y: Math.random() * 1200 - 600,
              scale: Math.random() * 0.8 + 0.3,
            }}
            animate={{ y: "+=200", x: "+=40", opacity: 0 }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 4,
              ease: "easeOut",
              delay: Math.random() * 3,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 bg-[#ffffff70] backdrop-blur-xl rounded-3xl shadow-[0_0_25px_rgba(255,200,80,0.25)] border border-yellow-600/40 px-12 py-16 text-center max-w-xl mx-4
        before:absolute before:inset-0 before:rounded-3xl before:border before:border-yellow-300/20 before:shadow-[0_0_40px_10px_rgba(255,220,160,0.25)]"
      >
        <h1 className="text-5xl font-extrabold text-[#c78b36] mb-4 drop-shadow-[0_0_10px_rgba(255,210,120,0.4)]">
          CONTACT US
        </h1>

        <p className="text-lg text-[#6e5a47] mb-8 tracking-wide">
          Hubungi kami untuk pemesanan atau informasi lebih lanjut
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(255,210,120,0.6)]"></div>

        {/* Icons */}
        <div className="flex space-x-10 justify-center mt-6">
          {[
            {
              icon: <FaWhatsapp />,
              link: "https://wa.me/6281553983211",
              color: "text-green-500",
            },
            {
              icon: <FaTiktok />,
              link: "https://www.tiktok.com/@crave.donuts?_t=ZS-90zIY3Lx3xP&_r=1",
              color: "text-black",
            },
            {
              icon: <FaInstagram />,
              link: "https://www.instagram.com/cravedonutss?igsh=bHNpYTg1djVmemNx",
              color: "text-pink-500",
            },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              className="relative group transition"
            >
              <div className="absolute inset-0 blur-xl bg-yellow-300/20 rounded-full opacity-0 group-hover:opacity-100 transition"></div>
              <div className={`text-5xl text-[#3a2a1f] group-hover:${item.color} transition`}>
                {item.icon}
              </div>
            </motion.a>
          ))}
        </div>

        <p className="text-sm text-[#6e5a47] mt-10 tracking-wide">
          © {new Date().getFullYear()} Crave Donut • All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Contact;