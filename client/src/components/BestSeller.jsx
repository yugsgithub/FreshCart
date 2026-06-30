import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-semibold mb-6'>Best Sellers</p>
      <div className="flex flex-wrap gap-6">
        {products?.slice(0, 5).map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
