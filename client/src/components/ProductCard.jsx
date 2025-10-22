import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="border rounded-lg p-4 hover:shadow-lg transition-shadow block">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-contain mb-3"
      />
      <h3 className="text-sm font-semibold mb-1 line-clamp-2">{product.name}</h3>
      <div className="flex items-center gap-1 text-yellow-400 mb-1">
        {Array.from({ length: Math.round(product.rating || 4) }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      <p className="font-bold text-lg mb-2">₹{product.price}</p>
      <button className="bg-yellow-400 hover:bg-yellow-500 w-full py-2 rounded text-sm font-semibold">
        Add to Cart
      </button>
    </Link>
  );
};

export default ProductCard;
