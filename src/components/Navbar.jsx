import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /* GET USER */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        setRole(profile?.role || "user");
      }
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);

        if (newUser) {
          supabase
            .from("profiles")
            .select("role")
            .eq("id", newUser.id)
            .single()
            .then(({ data }) => setRole(data?.role || "user"));
        } else setRole(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  /* Close profile menu when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src="/logo.png"
            className="h-12 drop-shadow-lg"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="hidden sm:block text-xl font-semibold tracking-wide text-gold drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Crave Donuts
          </motion.span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-10 text-white/90 font-semibold">
          {["/", "/about", "/products", "/cart", "/contact"].map(
            (route, i) => (
              <motion.li
                key={i}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={route} className="nav-item">
                  {route === "/" ? "HOME" : route.replace("/", "").toUpperCase()}
                </Link>
              </motion.li>
            )
          )}
        </ul>

        {/* PROFILE ICON */}
        <div ref={menuRef} className="hidden md:block relative">
          {user ? (
            <>
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                className="text-3xl text-white hover:text-gold transition"
                whileHover={{ scale: 1.08 }}
              >
                <FaUserCircle />
              </motion.button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {role === "admin" && (
                      <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="dropdown-item"
                      >
                        Admin Dashboard
                      </button>
                    )}

                    {role === "user" && (
                      <button
                        onClick={() => navigate("/profile")}
                        className="dropdown-item"
                      >
                        Profile
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-red-300 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-gold text-black font-semibold shadow-lg hover:bg-gold-light transition"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-3xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10 flex flex-col text-white items-center py-6 space-y-4"
          >
            <Link to="/" className="mobile-item">HOME</Link>
            <Link to="/about" className="mobile-item">ABOUT</Link>
            <Link to="/products" className="mobile-item">PRODUCTS</Link>
            <Link to="/cart" className="mobile-item">CART</Link>
            <Link to="/contact" className="mobile-item">CONTACT</Link>

            {user ? (
              <>
                {role === "admin" && (
                  <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="mobile-btn"
                  >
                    Admin Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="mobile-btn bg-red-400 text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-btn">Masuk</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STYLES */}
      <style>{`
        .text-gold { color: #d4a256; }
        .bg-gold { background-color: #d4a256; }
        .bg-gold-light { background-color: #e4b877; }

        .nav-item {
          position: relative;
          padding-bottom: 3px;
          transition: 0.25s;
        }
        .nav-item:hover {
          color: #d4a256;
        }
        .nav-item::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0%;
          height: 2px;
          background: #d4a256;
          transition: width .3s;
        }
        .nav-item:hover::after {
          width: 100%;
        }

        .dropdown-item {
          width: 100%;
          text-align: left;
          padding: 12px 18px;
          font-size: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(212,162,86,0.15);
          color: #d4a256;
        }

        .mobile-item {
          width: 100%;
          text-align: center;
          padding: 10px 0;
          font-size: 1.05rem;
          transition: 0.2s;
        }
        .mobile-item:hover {
          color: #d4a256;
        }

        .mobile-btn {
          background: #d4a256;
          color: #000;
          padding: 10px 26px;
          border-radius: 30px;
          font-weight: bold;
          transition: 0.2s;
        }
        .mobile-btn:hover {
          background: #e4b877;
        }
      `}</style>
    </nav>
  );
}
