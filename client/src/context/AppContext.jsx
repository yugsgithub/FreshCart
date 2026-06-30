console.log("🔍 VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Axios default config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [currency] = useState("₹");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Fetch seller status (for /seller/* pages only)
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (err) {
      setIsSeller(false);
    }
  };

  // ✅ Fetch user info
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);

        const dbCart = data.user.cartItems || {};
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || {};
        const mergedCart = { ...dbCart, ...localCart };

        setCartItems(mergedCart);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setCartItems(JSON.parse(localStorage.getItem("cartItems")) || {});
      }
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      setCartItems(JSON.parse(localStorage.getItem("cartItems")) || {});
    }
  };

  // ✅ Logout (toast removed)
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        setCartItems({});
        // 🍃 Let Navbar handle toast
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Cart helpers
  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = products.find((p) => p._id === id);
      if (item) total += item.offerPrice * cartItems[id];
    }
    return Math.floor(total * 100) / 100;
  };

  // ✅ Cart actions
  const addToCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateCartItems = (productId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const removeOneFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const clearCart = () => setCartItems({});

  const login = () => {
    setIsLoggedIn(true);
    setShowLoginPopup(false);
  };

  // ✅ Initial app load
  useEffect(() => {
    fetchUser();
    fetchProducts();

    if (window.location.pathname.startsWith("/seller")) {
      fetchSeller();
    }
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Sync cart with DB
  useEffect(() => {
    const syncCart = async () => {
      if (!user?._id) return;
      try {
        const { data } = await axios.post("/api/cart/update", {
          userId: user._id,
          cartItems,
        });
        if (!data.success) toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (user) syncCart();
  }, [cartItems]);

  return (
    <AppContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        removeFromCart,
        removeOneFromCart,
        updateCartItems,
        clearCart,
        currency,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        showLoginPopup,
        setShowLoginPopup,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts: selectedCategory
          ? products.filter((p) => p.category === selectedCategory)
          : products,
        getCartCount,
        getCartAmount,
        isSeller,
        setIsSeller,
        axios,
        fetchSeller,
        fetchProducts,
        user,
        setUser,
        setCartItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
