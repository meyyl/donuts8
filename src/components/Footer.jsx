import { FaTiktok, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="relative bg-[#3b2a26] text-[#fff7ef] overflow-hidden">
      {/* Decorative floating circles */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#d4a256]/20 blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#6b3e23]/15 blur-[100px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
        {/* Column 1: About with glass card */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-xl font-bold text-[#d4a256]">Crave Donuts</h3>
          <p className="mt-2 text-[#fff7ef]/90 text-sm">
            Taste the craft — ringan, lembut, & dibuat tiap hari. <span className="italic">Elegance in every bite.</span>
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://www.tiktok.com/@crave.donuts?_t=ZS-90zIY3Lx3xP&_r=1" className="hover:text-[#d4a256] transition"><FaTiktok /></a>
            <a href="https://www.instagram.com/cravedonutss?igsh=bHNpYTg1djVmemNx" className="hover:text-[#d4a256] transition"><FaInstagram /></a>
            <a href="https://wa.me/6281553983211" className="hover:text-[#d4a256] transition"><FaWhatsapp /></a>
          </div>
        </motion.div>

        {/* Column 2: Quick Links */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <h4 className="text-lg font-semibold text-[#d4a256]">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-[#fff7ef]/90">
  <li><Link to="/about" className="hover:text-[#d4a256] transition">Our Story</Link></li>
  <li><Link to="/products" className="hover:text-[#d4a256] transition">Shop Now</Link></li>
  <li><Link to="/contact" className="hover:text-[#d4a256] transition">Contact</Link></li>
</ul>

        </motion.div>

        {/* Column 3: Newsletter */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/20"
        >
          <h4 className="text-lg font-semibold text-[#d4a256]">Subscribe</h4>
          <p className="mt-2 text-sm text-[#fff7ef]/90">
            Join our newsletter for daily specials & updates.
          </p>
          <form
  className="mt-4 flex gap-2"
  onSubmit={(e) => {
    e.preventDefault();
    const email = e.target.email.value;
    window.location.href = `mailto:cravedonutss@gmail.com?subject=Subscribe Crave Donuts&body=Halo, saya ingin subscribe.%0AEmail: ${email}`;
  }}
>
  <input
    type="email"
    name="email"
    required
    placeholder="Your email"
    className="flex-1 px-4 py-2 rounded-full border border-white/30 bg-white/10 placeholder-[#fff7ef]/70 text-white focus:outline-none"
  />
  <motion.button
    type="submit"
    whileHover={{ scale: 1.1, rotate: 5 }}
    className="px-4 py-2 rounded-full bg-[#d4a256] text-[#3b2a26] font-semibold shadow"
  >
    <FaEnvelope />
  </motion.button>
</form>

        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-10 border-t border-white/20 py-4 text-center text-sm text-[#fff7ef]/70">
        &copy; {new Date().getFullYear()} Crave Donuts. All rights reserved.
      </div>
    </footer>
  );
}
