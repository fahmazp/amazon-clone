import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/api/orderAPI";
import { toast } from "sonner";
import { Truck, ShieldCheck, CreditCard, ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  // Guard: require login and items in cart
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.info("Please sign in to proceed with checkout");
        navigate("/login?redirect=/checkout");
      } else if (cart.length === 0) {
        navigate("/cart");
      }
    }
  }, [user, authLoading, cart.length, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.address.trim() || !shippingAddress.city.trim() || !shippingAddress.postalCode.trim()) {
      toast.error("Please fill in all required shipping address fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
      };

      const res = await createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center text-gray-500">Checking authentication...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Truck className="text-yellow-500" size={20} /> Shipping Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main Street, Apt 4B"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 400001"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="text-yellow-500" size={20} /> Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-yellow-400 bg-yellow-50/50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-yellow-500 focus:ring-yellow-400"
                />
                <div className="flex-1">
                  <span className="font-semibold text-sm text-gray-900">
                    Cash on Delivery (Simulated)
                  </span>
                  <p className="text-xs text-gray-500">
                    Pay with cash when your shipment arrives at your doorstep.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b pb-3">
              Order Review ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </h2>

            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 mb-4 pr-1">
              {cart.map((item) => (
                <div key={item.product?._id || item.product} className="py-2 flex items-center gap-3">
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name}
                    className="w-12 h-12 object-contain rounded bg-gray-50 border p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {item.product?.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} × ₹{item.product?.price}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 border-t pt-3 mb-6">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-gray-800">
                  {shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (1%):</span>
                <span className="font-semibold text-gray-800">₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-yellow-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded shadow transition disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Confirm & Place Order"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 mt-4">
              <ShieldCheck size={14} className="text-green-600" />
              Safe and secure checkout guarantee
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
