import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import CustomToast from "../components/CustomToast";

const ProductDetails = () => {
  const { category, id } = useParams();
  const { products } = useAppContext();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useAppContext();

  useEffect(() => {
    console.log("All products:", products);
    console.log("Looking for ID:", id);
    if (products.length > 0) {
      const found = products.find((item) => String(item._id) === String(id));
      console.log("Found product:", found);
      setProduct(found);
      if (found) setThumbnail(found.images?.[0]);
    }
  }, [products, id]);

  if (!product) {
    return (
      <div className="mt-24 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item._id !== product._id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 mt-20">
      <p className="text-sm text-gray-500 mb-4">
        Home / Products / {category} /{" "}
        <span className="text-green-600">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setThumbnail(img)}
                className={`w-20 border rounded cursor-pointer ${
                  thumbnail === img
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
          <img
            src={thumbnail}
            alt={product.name}
            className="w-72 h-72 object-cover border rounded"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>

          <div className="text-xl text-green-600 font-bold mb-2">
            ₹{product.offerPrice}{" "}
            <span className="text-gray-400 line-through text-base">
              ₹{product.price}
            </span>
          </div>

          <p className="font-medium mt-6 mb-2">About Product:</p>
          <ul className="list-disc ml-5 text-gray-600">
            {product.description.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                addToCart(product._id);
                toast.success(<CustomToast message="Added to Cart" />, {
                  className: "minimal-toast",
                  closeButton: false,
                  autoClose: 1500,
                  hideProgressBar: true,
                });
              }}
              className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                toast.success(<CustomToast message="Added to Cart" />, {
                  className: "minimal-toast",
                  closeButton: false,
                  autoClose: 1500,
                  hideProgressBar: true,
                });
                navigate("/cart");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-green-600 rounded-full items-center mt-2"></div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-10">
          {relatedProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/allProducts");
            scrollTo(0, 0);
          }}
          className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-green-600 hover:bg-green-700 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
