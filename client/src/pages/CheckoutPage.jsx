import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/api/orderAPI";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.01 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
      };

      const res = await createOrder(orderData);

      alert("Order placed successfully!");
      navigate(`/order/${res._id}`);
    } catch (error) {
      alert(error.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Shipping Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>

          <input
            type="text"
            placeholder="Address"
            className="w-full border p-2 rounded"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="City"
            className="w-full border p-2 rounded"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            className="w-full border p-2 rounded"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                postalCode: e.target.value,
              })
            }
            required
          />
          <input
            type="text"
            placeholder="Country"
            className="w-full border p-2 rounded"
            value={shippingAddress.country}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, country: e.target.value })
            }
            required
          />

          <h3 className="text-lg font-semibold mt-6 mb-2">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="border p-4 rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>Items: ₹{itemsPrice.toFixed(2)}</p>
            <p>Shipping: ₹{shippingPrice.toFixed(2)}</p>
            <p>Tax: ₹{taxPrice.toFixed(2)}</p>
            <hr />
            <p className="font-bold text-lg text-orange-900">
              Order Total: ₹{totalPrice.toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-semibold text-black"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
