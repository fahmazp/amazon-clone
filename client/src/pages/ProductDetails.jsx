import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { addToCart } from "../api/cartAPI";
import { useCart } from "../context/CartContext";
import { Star } from "lucide-react";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { setCart } = useCart();
  const [loading, setLoading] = useState(true);

  // Fetch prod details
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

  // Add to cart logic
  const handleAddToCart = async () => {

    if (product.countInStock === 0) {
      toast.error("Product is out of stock");
      return;
    }    
    try {
      const updatedCart = await addToCart(product._id, 1);
      setCart(updatedCart.items);
      toast.success("Item added to cart", {
      description: product.name,
    });
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  // if (!product) return <div className="p-6">Loading...</div>;
  if (loading)
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (!product)
    return (
      <div className="text-center mt-20 text-red-500">Product not found.</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 my-2">
      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-sm md:w-96 h-auto md:h-96 object-contain border rounded-md mx-auto md:mx-0"
        />
        <div className="flex flex-col">
          <h3 className="text-sm text-blue-800 font-medium mb-2 cursor-pointer">Brand:&nbsp;{product.brand}</h3>
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <div className="flex items-center gap-1 text-yellow-400 mb-3">
            {Array.from({ length: Math.round(product.rating || 4) }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-xl font-bold mb-2">₹{product.price}</p>
          <p className={`mb-2 font-medium text-sm ${
              product.countInStock > 0 ? "text-green-700" : "text-red-600"
            }`}
          >
            {product.countInStock > 0
             ? `In Stock - (${product.countInStock} available)`
             : "Out of Stock - Currently Unavailable"}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`px-8 xl:px-10 py-2 rounded font-semibold transition
              ${
                product.countInStock === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }
            `}
            >
              Add to Cart
            </button>

            <button
              disabled={product.countInStock === 0}
              onClick={() => {
                toast("Proceeding to buy", {
                  description: product.name,
                });
              }}
              className={`px-8 xl:px-10 py-2 rounded font-semibold transition
                ${
                  product.countInStock === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }
              `}
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
