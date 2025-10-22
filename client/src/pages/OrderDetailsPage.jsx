import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "@/api/orderAPI";
import { CheckCircle } from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading order details...</div>;

  if (!order)
    return (
      <div className="p-6 text-center text-gray-800">
        <p>Order not found!</p>
        <Link
          to="/"
          className="mt-3 inline-block bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold"
        >
          Back to Home
        </Link>
      </div>
    );

  const { orderItems, shippingAddress, paymentMethod, totalPrice, taxPrice, shippingPrice, itemsPrice } = order;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
      </div>

      <p className="text-gray-600 mb-4">Order ID: <span className="font-mono">{order._id}</span></p>

      {/* Shipping Details */}
      <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
        <p>{shippingAddress.address}</p>
        <p>
          {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
        </p>
      </div>

      <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
        <p>{paymentMethod}</p>
        <p className="text-sm text-gray-600 font-semibold">
          Status: {order.isPaid ? "Paid ✅" : "Pending"}
        </p>
      </div>

      {/* Ordered Items */}
      <div className="border p-4 rounded-md mb-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Ordered Items</h3>
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div
              key={item.product}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain border rounded-md"
                />
                <div>
                  <Link
                    to={`/product/${item.product}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} x {item.qty}
                  </p>
                </div>
              </div>
              <p className="font-semibold">
                ₹{(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
        <div className="space-y-1 text-gray-700 text-sm">
          <p>Items: ₹{itemsPrice.toFixed(2)}</p>
          <p>Shipping: ₹{shippingPrice.toFixed(2)}</p>
          <p>Tax: ₹{taxPrice.toFixed(2)}</p>
          <hr className="my-2" />
          <p className="font-bold text-lg">Total: ₹{totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
