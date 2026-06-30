import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { category } = useParams(); // Get category from URL
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    let updatedProducts = products;

    // Filter by search query
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category only if it exists
    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchQuery, category]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">
          {category ? category : 'All Products'}
        </p>
        <div className="w-16 h-0.5 bg-green-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
