import React from "react";
import logo from "/logo.png";

const About = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f5efe7] via-[#f0e7da] to-[#e6d7c3] flex flex-col items-center justify-center px-6 py-26">

      {/* Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-amber-300/20 blur-3xl rounded-full"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <h1 className="text-5xl font-extrabold text-[#3b2215] mb-10 tracking-wide drop-shadow-sm relative z-10">
        About <span className="text-[#b8863b]">CraveDonut</span>
      </h1>

      {/* Logo */}
      <div className="relative group mb-12 z-10">
        <div className="absolute inset-0 bg-[#d4a056]/40 blur-2xl rounded-full"></div>

        <img
          src={logo}
          alt="CraveDonut Logo"
          className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover shadow-xl border-4 border-[#d4a056] transform 
                     group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 rounded-full bg-[#d4a056]/20 opacity-0 group-hover:opacity-40 transition duration-500 blur-2xl"></div>
      </div>

      {/* Description */}
      <div className="max-w-3xl text-center relative z-10">
        <p className="text-lg md:text-xl text-[#4a2c1a] leading-relaxed mb-6 font-medium">
          <span className="font-bold text-[#b8863b]">CraveDonut</span> hadir untuk menyajikan 
          donat premium dengan cita rasa khas dan tekstur lembut. Kami mengutamakan kualitas bahan 
          terbaik agar setiap gigitan memberikan pengalaman nikmat yang tak terlupakan.
        </p>

        <p className="text-[#b8863b] font-semibold italic text-xl mt-4">
          "Crafted with Passion, Served with Love."
        </p>
      </div>

      {/* Bottom subtle line decoration */}
      <div className="w-32 h-1 mt-10 bg-gradient-to-r from-transparent via-[#b8863b] to-transparent opacity-70"></div>
    </div>
  );
};

export default About;
