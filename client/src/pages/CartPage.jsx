import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Share2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    cartCount,
    loading,
  } = useCart();

  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    try {
      setUpdatingId(productId);
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleIncrease = async (item) => {
    const productId = item.product?._id || item.product;
    const currentQty = Number(item.quantity) || 1;
    const maxStock = item.product?.countInStock;

    if (maxStock !== undefined && currentQty >= maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }

    try {
      setUpdatingId(productId);
      await updateQuantity(productId, currentQty + 1);
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecrease = async (item) => {
    const productId = item.product?._id || item.product;
    const currentQty = Number(item.quantity) || 1;

    try {
      setUpdatingId(productId);
      await updateQuantity(productId, currentQty - 1);
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShareProduct = (productId) => {
    try {
      const productLink = `${window.location.origin}/product/${productId}`;
      navigator.clipboard.writeText(productLink);
      toast.success("Product link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center text-gray-500">
        Loading your cart...
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-4">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-sm mb-6">
          Looks like you haven't added anything to your cart yet. Explore our latest arrivals!
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded shadow-sm transition"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const prod = item.product || {};
            const prodId = prod._id || item.product;

            return (
              <div
                key={item._id || `${prodId}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link to={`/product/${prodId}`} className="shrink-0">
                    <img
                      src={prod.image || "/placeholder.png"}
                      alt={prod.name || "Product"}
                      className="w-20 h-20 object-contain rounded border border-gray-100 bg-gray-50 p-1"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${prodId}`}
                      className="font-medium text-gray-900 hover:text-blue-600 text-sm line-clamp-2"
                    >
                      {prod.name || "Product"}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Unit Price: ₹{prod.price || 0}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      Total: ₹{((prod.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={updatingId === prodId}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-gray-800 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={updatingId === prodId}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShareProduct(prodId)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Share link"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(prodId)}
                      disabled={updatingId === prodId}
                      className="text-red-500 hover:text-red-700 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Items ({cartCount}):</span>
                <span className="font-medium text-gray-900">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium text-gray-900">
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    `₹${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (1%):</span>
                <span className="font-medium text-gray-900">₹{taxPrice.toFixed(2)}</span>
              </div>

              {itemsPrice < 100 && itemsPrice > 0 && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                  Add ₹{(100 - itemsPrice).toFixed(2)} more of eligible items to get <strong>FREE Delivery</strong>.
                </p>
              )}

              <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Order Total:</span>
                <span className="text-yellow-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded shadow transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
