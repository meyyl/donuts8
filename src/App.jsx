import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// 🔹 Layout + Footer
import MainLayout from "./components/MainLayout";

// 🔹 Halaman umum
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Success from "./pages/Success";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Profile from "./pages/Profile";

// 🔹 Halaman admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import OrderDetail from "./pages/admin/OrderDetail"; 

// 🔹 Scroll to top ketika ganti route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 🔹 Halaman tidak ditemukan
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#3b2215] text-white">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-lg mb-6">Halaman tidak ditemukan 😢</p>
      <a
        href="/"
        className="px-6 py-3 bg-yellow-300 text-[#3b2215] rounded-full font-semibold hover:bg-yellow-400 transition"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}

// 🔹 Komponen utama App
function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Semua halaman umum + Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/success" element={<Success />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 page untuk halaman umum */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Halaman admin (tidak ada Footer) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/order/:id" element={<OrderDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
