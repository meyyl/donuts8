import React from "react";

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-[#fffaf5] p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-[#e2c8aa]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#3b2215]">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-[#3b2215]">✕</button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
