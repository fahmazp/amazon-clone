import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.countInStock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }
    if (addToCart) {
      addToCart(product, 1);
    }
    toast.success("Added to cart", { description: product.name });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all flex flex-col justify-between bg-white relative group"
    >
      <div>
        <div className="relative w-full h-48 mb-3 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-44 max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
          {isOutOfStock ? (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
              Out of Stock
            </span>
          ) : product.countInStock <= 5 ? (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
              Only {product.countInStock} left
            </span>
          ) : null}
        </div>

        {product.category && (
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            {product.category}
          </span>
        )}

        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-amber-400 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(product.rating || 4) ? "currentColor" : "none"}
              className={i < Math.round(product.rating || 4) ? "text-amber-400" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="font-bold text-lg text-gray-900 mb-2">₹{product.price}</p>
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded text-sm font-semibold transition-colors ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 active:scale-[0.98]"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
