import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import CustomToast from './CustomToast'; // ✅ assuming this is in src/components/

const Navbar = () => {
  const {
    isLoggedIn,
    login,
    logout,
    setShowLoginPopup,
    setSearchQuery,
    searchQuery,
    getCartCount,
  } = useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/allproducts");
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 border border-gray-200 rounded-xl mt-4 mx-4 bg-white shadow-sm">
      {/* Logo */}
      <NavLink to='/'>
        <img className="h-12" src={assets.fresh} alt="fresh" />
      </NavLink>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-800">
        <NavLink to="/" className="hover:text-green-600">Home</NavLink>
        <NavLink
          to="/allproducts"
          onClick={() => setSearchQuery("")}
          className="hover:text-green-600"
        >
          All Products
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden lg:flex items-center border rounded-full px-3 py-1.5"
        >
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent text-sm placeholder-gray-500 w-32 lg:w-48"
            type="text"
            placeholder="Search products"
          />
          <svg width="16" height="16" fill="none" stroke="gray" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
          </svg>
        </form>

        {/* Cart */}
        <NavLink to="/cart" className="relative cursor-pointer">
          <svg width="24" height="24" fill="none" stroke="#6366F1" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5h12.6M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <button className="absolute -top-2 -right-2 text-[10px] font-semibold text-white bg-green-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">{getCartCount()}</button>
        </NavLink>

        {/* Login/User */}
        <div className="relative" ref={dropdownRef}>
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLoginPopup(true)}
              className="px-6 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
            >
              Login
            </button>
          ) : (
            <>
              <img
                src={assets.profile_icon}
                alt="User"
                className="w-9 h-9 rounded-full cursor-pointer border border-gray-300 hover:ring-2 ring-green-400 transition"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <NavLink
                    to="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </NavLink>
                  <button
                    onClick={async () => {
                      await logout();
                      setMenuOpen(false);
                      toast(<CustomToast message="Logged out" />, {
                        className: "minimal-toast",
                        closeButton: false,
                        autoClose: 1500,
                        hideProgressBar: true,
                      });
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
