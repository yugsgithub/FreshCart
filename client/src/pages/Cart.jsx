import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateCartItems,
    getCartAmount,
    getCartCount,
    removeOneFromCart,
    clearCart,
    axios,
    user,
    setCartItems
  } = useAppContext();

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");

  const cartArray = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((item) => item._id === id);
      if (product) {
        return { ...product, quantity: cartItems[id] };
      }
      return null;
    })
    .filter(Boolean);

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      const orderItems = cartArray.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      }));

      const endpoint = paymentOption === "COD" ? "/api/order/cod" : "/api/order/stripe";

      const { data } = await axios.post(endpoint, {
        userId: user._id,
        items: orderItems,
        address: selectedAddress._id,
      });

      if (data.success) {
        if (paymentOption === "COD") {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          window.location.replace(data.url);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".address-dropdown") && !e.target.closest(".change-address-btn")) {
        setShowAddress(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  return products.length > 0 && cartArray.length > 0 ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-green-600">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base text-gray-600 pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/allproducts/${product.category.toLowerCase()}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.images?.[0] || assets.placeholder_image}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight: <span>{product.weight || "N/A"}</span></p>
                  <div className="flex items-center mt-1">
                    <p>Qty:</p>
                    <select
                      value={cartItems[product._id]}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value);
                        updateCartItems(product._id, newQty);
                        toast.info("Cart updated", {
                          className: "minimal-toast",
                          closeButton: false,
                          autoClose: 1500,
                          hideProgressBar: true,
                        });
                      }}
                      className="ml-2 border border-gray-300 rounded px-1 py-0.5"
                    >
                      {Array.from({ length: Math.max(9, cartItems[product._id]) }).map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>

            <button
              onClick={() => {
                removeOneFromCart(product._id);
                toast.info("Item Removed from cart", {
                          className: "minimal-toast",
                          closeButton: false,
                          autoClose: 1500,
                          hideProgressBar: true,
                        });
              }}
              className="mx-auto text-red-500 text-2xl font-bold"
              title="Remove one"
            >
              ❎
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="mt-4 text-red-600 underline text-sm"
        >
          Remove All Items
        </button>

        <button
          onClick={() => {
            navigate("/allproducts");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-green-600 font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>

          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500 max-w-[220px] text-sm leading-snug">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>

            <button
              className="text-green-600 hover:underline cursor-pointer change-address-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (addresses.length === 0) {
                  navigate("/add-address");
                } else {
                  setShowAddress(true);
                }
              }}
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 left-0 z-50 w-full py-1 bg-white border border-gray-300 text-sm shadow-lg address-dropdown">
                {addresses.map((address, i) => (
                  <p
                    key={i}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {address.street}, {address.city}, {address.state}, {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-green-600 text-center cursor-pointer p-2 hover:bg-green-700/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            value={paymentOption}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{getCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency}{(getCartAmount() * 1.02).toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : (
    <div className="text-center mt-24 text-gray-500 text-lg">Your cart is empty</div>
  );
};

export default Cart;
