import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/getProduct/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product || product.countInStock <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addToCart(product, 1);
      toast.success("Item added to cart", {
        description: product.name,
      });
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.countInStock <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    try {
      await addToCart(product, 1);
      navigate("/checkout");
    } catch (err) {
      toast.error(err?.message || "Failed to proceed to buy");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-500">Loading product details...</div>;
  }
  if (!product) {
    return (
      <div className="text-center mt-20 text-red-500 font-medium">
        Product not found.
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;

  return (
    <div className="max-w-6xl mx-auto p-6 my-2">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full max-w-sm md:w-96 h-auto md:h-96 border rounded-md mx-auto md:mx-0 p-4 bg-white flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex flex-col flex-1">
          {product.brand && (
            <h3 className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-1">
              Brand: {product.brand}
            </h3>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

          <div className="flex items-center gap-1 text-yellow-400 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(product.rating || 4) ? "currentColor" : "none"}
                className={i < Math.round(product.rating || 4) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-xs text-gray-500 ml-2">
              ({product.numReviews || 0} customer ratings)
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          <p className="text-2xl font-extrabold text-gray-900 mb-2">₹{product.price}</p>

          <p
            className={`mb-4 font-semibold text-sm ${
              !isOutOfStock ? "text-green-700" : "text-red-600"
            }`}
          >
            {!isOutOfStock
              ? `In Stock - (${product.countInStock} available)`
              : "Out of Stock - Currently Unavailable"}
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-8 py-2.5 rounded font-semibold text-sm transition shadow-sm ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              }`}
            >
              Add to Cart
            </button>

            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`px-8 py-2.5 rounded font-semibold text-sm transition shadow-sm ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
