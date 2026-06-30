import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <div className="relative mt-24">
      <img src={assets.bottom_banner_image} alt="banner" className="w-full object-cover" />

      <div className="absolute inset-0 px-6 py-10 md:px-24 md:py-0 flex flex-col md:justify-center md:items-end justify-start items-start text-left gap-6 bg-black/0">
        <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg w-full md:w-[500px]">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-4 text-left">
            Why We Are the Best :
          </h1>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <img src={feature.icon} alt={feature.title} className="w-8 md:w-10 mt-1" />
                <div className="text-left">
                  <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
