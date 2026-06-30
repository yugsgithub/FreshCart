import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className="relative rounded-xl overflow-hidden mt-4 h-[350px]">
      {/* Background Image */}
      <img 
        src={assets.main_banner_bg} 
        alt="banner" 
        className="w-full h-full object-cover" 
      />

      {/* Overlay Text & Buttons */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center px-4 md:px-16 lg:px-24 text-black">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-[700px] leading-tight">
          Freshness You Can Trust, Savings 
          You will Love!
        </h1>

        <div className="flex flex-wrap items-center mt-6 gap-4 font-medium">
          <Link
            to={"/allproducts"}
            className="group flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded text-white font-medium"
          >
            Shop now
            <img
              className="w-4 h-4 transition group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to={"/products"}
            className="group flex items-center gap-2 px-6 py-3 text-green-700 font-medium hover:underline"
          >
            Explore deals
            <img
              className="w-4 h-4 transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
