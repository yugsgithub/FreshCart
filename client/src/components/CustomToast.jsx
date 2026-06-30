// CustomToast.jsx
import React from "react";
import { assets } from "../assets/assets"; // adjust this path if needed

const CustomToast = ({ message }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={assets.cart_icon} // your trolley icon
        alt="cart"
        className="w-5 h-5"
      />
      <span className="text-sm font-medium text-gray-800">{message}</span>
    </div>
  );
};

export default CustomToast;
