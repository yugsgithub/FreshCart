import React, {useEffect} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import SellerOrders from './pages/seller/SellerOrders';
import { ToastContainer } from "react-toastify";
import { useAppContext } from './context/AppContext';

import './toastStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './components/Loading';

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showLoginPopup, isSeller, fetchSeller } = useAppContext();

  useEffect(() => {
    fetchSeller(); // ⬅️ runs once on app load
  }, []);

  return (
    <div className="relative">
      {/* Show Navbar if not on /seller path */}
      {!isSellerPath && <Navbar />}

      <div className={`${!isSellerPath ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""}`}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allproducts/:category?" element={<AllProducts />} />
        <Route path="/products/:category?/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/loader" element={<Loading />} />


        {/* Seller Route Nesting Fix */}
        {!isSeller ? (
          <Route path="/seller/*" element={<SellerLogin />} />
        ) : (
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>
        )}
      </Routes>
      </div>

      {/* Footer only for customer views */}
      {!isSellerPath && <Footer />}

      {/* Toast */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="colored"
      />

      {/* Login Popup */}
      {showLoginPopup && <Login />}
    </div>
  );
};

export default App;
