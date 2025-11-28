import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import About from "./About";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Welcome() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

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
      `)
      .order("created_at", { ascending: false });

    if (error) return console.error(error.message);

    const formatted = data.map((p) => {
      const avg =
        p.reviews?.length > 0
          ? (
              p.reviews.reduce((acc, r) => acc + r.rating, 0) /
              p.reviews.length
            ).toFixed(1)
          : 0;
      return { ...p, avgRating: avg };
    });

    setProducts(formatted.slice(0, 6)); // tampilkan lebih banyak di landing
  };

  return (
    <>
      {/* HERO */}
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff7ef] to-[#f3ede9]">
        {/* soft background pattern (subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#fff7ef" stopOpacity="1" />
                <stop offset="100%" stopColor="#efe7e2" stopOpacity="1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)" />
          </svg>
        </div>

        {/* soft overlay from bottom (slightly dark) */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#1b120e]/10 to-transparent"></div>

        {/* floating decor */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-12 top-20 w-24 h-24 rounded-full bg-[#d4a256]/20 blur-[28px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-16 bottom-28 w-36 h-36 rounded-full bg-[#6b3e23]/18 blur-[32px] pointer-events-none"
        />

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 py-26"
        >
          {/* Left: text */}
          <div className="flex-1 text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#3b2a26]">
              Crave Donuts
            </h1>
            <p className="mt-4 text-lg text-[#4b362b]/90 max-w-xl">
              Taste the craft — ringan, lembut, & dibuat tiap hari. <span className="italic text-[#a47a46]">Elegance in every bite.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <motion.a
                whileHover={{ scale: 1.04 }}
                className="inline-block px-6 py-3 rounded-full bg-[#3b2a26] text-white font-semibold shadow-md hover:shadow-xl transition"
                href="#featured"
              >
                Explore Featured
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                className="inline-block px-5 py-3 rounded-full border border-[#3b2a26] text-[#3b2a26] font-medium bg-white/70 backdrop-blur-sm"
                href="#about"
              >
                Our Story
              </motion.a>
            </div>

            {/* quick highlights */}
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4a256]/20 flex items-center justify-center">
                  <span className="text-[#6b3e23] font-bold">01</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#3b2a26]">Fresh Daily</div>
                  <div className="text-xs text-[#4b362b]">Made every morning</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6b3e23]/12 flex items-center justify-center">
                  <span className="text-[#6b3e23] font-bold">02</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#3b2a26]">Premium Ingredients</div>
                  <div className="text-xs text-[#4b362b]">Real butter & cocoa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: hero card with donut image (glass) */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="w-full md:w-[420px] rounded-3xl bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl p-4"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/donuts-oreo.jpeg"
                alt="donut"
                className="w-full h-64 object-cover"
              />
              <div className="absolute left-4 bottom-4 bg-[#3b2a26] text-white px-3 py-2 rounded-full text-sm font-semibold shadow">
                Best Seller
              </div>
            </div>

            <div className="mt-4">
              <div className="text-lg font-bold text-[#3b2a26]">Classic Honey Glaze</div>
              <div className="text-sm text-[#4b362b] mt-1">Donut super lembut dengan topping krim manis dan Oreo yang crunchy. Rasanya rich, manisnya pas, dan bikin nagih tiap gigitan. Once you try, you’ll crave it again</div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-2xl font-extrabold text-[#6b3e23]">Rp 4.000</div>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  className="px-4 py-2 rounded-full bg-[#d4a256] text-[#1b120e] font-semibold shadow"
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6b3e23] opacity-80"
        >
          ↓
        </motion.div>
      </header>

      {/* ABOUT (more interesting) */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-[#3b2a26] text-center"
          >
            Our Story & Craft
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* image */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="/about-baking.jpeg" alt="baking" className="w-full h-80 object-cover" />
            </div>

            {/* text + timeline */}
            <div className="space-y-6">
              <p className="text-[#4b362b]">
                We mix fresh ideas with modern baking techniques to create donuts that feel new, exciting, and perfectly balanced in every bite.
              </p>

              <div className="space-y-4">
                <FeatureItem number="2025" title="The Fresh Start" desc="This year marked our official relaunch with a brand-new lineup of flavors. From Oreo and Matcha to Red Velvet, Strawberry, Glaze, and Crumble — each donut was crafted to match today’s taste trends and deliver a memorable bite."/>
                <FeatureItem number="2026" title="Growing Forward" desc="With more customers discovering our creations, we focused on improving quality, consistency, and creativity. New experiments, better ingredients, and refined techniques push us to keep evolving while staying true to what we love: making great donuts every day."/>
              </div>

              <div className="mt-4">
                <Link to="/about" className="inline-block px-5 py-2 rounded-full border border-[#3b2a26] text-[#3b2a26]">
                  Read More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS (not kaku, animated grid) */}
      <section id="featured" className="py-20 bg-[#fcfbf9]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-[#3b2a26] text-center mb-10"
          >
            Featured Picks
          </motion.h2>

          {products.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {}
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((p, i) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.995 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-[#efe6dd]"
                >
                  {/* image area with playful badge */}
                  <div className="relative">
                    <img src={p.image_url || "/placeholder.png"} alt={p.name} className="w-full h-56 object-cover" />
                    <div className="absolute left-4 top-4 bg-[#d4a256] text-[#1b120e] px-3 py-1 rounded-full text-xs font-semibold shadow">
                      New
                    </div>
                    <div className="absolute right-4 top-4 bg-white/80 rounded-full p-2 shadow">
                      <button className="text-[#3b2a26]">
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>

                  {/* content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#3b2a26]">{p.name}</h3>
                    <p className="mt-2 text-sm text-[#6b5a53] line-clamp-2">{p.description || "Delicious & handcrafted."}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#6b5a53]">Starting at</div>
                        <div className="text-xl font-bold text-[#6b3e23]">Rp {Number(p.price).toLocaleString("id-ID")}</div>
                      </div>

                      <div className="flex items-center gap-2 text-[#d4a256]">
                        {[...Array(5)].map((_, idx) => (
                          <FaStar key={idx} className={idx < Math.round(p.avgRating) ? "text-[#d4a256]" : "text-[#e6e0db]"} />
                        ))}
                        <span className="text-sm text-[#6b5a53] ml-2">{p.avgRating}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link to={`/product/${p.id}`} className="flex-1 text-center py-2 rounded-xl border border-[#efe6dd] text-[#3b2a26]">
                        View
                      </Link>
                      <motion.button whileHover={{ scale: 1.04 }} className="px-4 py-2 rounded-xl bg-[#d4a256] text-[#1b120e] font-semibold">
                        Add
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-[#6b5a53]">Produk belum tersedia.</p>
          )}

          <div className="mt-12 text-center">
            <Link to="/products" className="inline-block px-8 py-3 rounded-full border border-[#3b2a26] text-[#3b2a26]">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* small footer-ish CTA */}
      <section className="py-12 bg-[#fff7ef]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-[#3b2a26]">Love what you see?</h4>
            <p className="text-sm text-[#6b5a53]">Order now or visit our shop for daily specials.</p>
          </div>
          <div>
            <Link to="/products" className="px-6 py-3 bg-[#3b2a26] text-white rounded-full shadow">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* small components */}
      {/* FeatureItem used in About */}
      {/* Inline to keep single-file for ease; you can extract to separate file */}
      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  );
}

/* Small presentational component inserted at bottom so file is single-copy */
function FeatureItem({ number, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="min-w-[56px] w-[56px] h-[56px] rounded-xl bg-[#3b2a26] flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#3b2a26]">{title}</div>
        <div className="text-sm text-[#6b5a53]">{desc}</div>
      </div>
    </div>
  );
}
