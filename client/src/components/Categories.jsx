import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const { setSelectedCategory } = useAppContext();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryText) => {
  navigate(`/allproducts/${categoryText.trim().toLowerCase()}`);
};


  return (
    <div className="mt-16 relative z-50">
      <h2 className="text-3xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.path)}
            className="rounded-xl shadow-md hover:shadow-xl text-center p-4 cursor-pointer z-50"
            style={{ backgroundColor: category.bgColor }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="mx-auto h-20 object-contain mb-3"
            />
            <p className="text-gray-800 font-medium">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
