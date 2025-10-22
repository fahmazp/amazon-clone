import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/api/orderAPI";
import { Link } from "react-router-dom";
import { Clock, Package, IndianRupee } from "lucide-react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading your orders...</div>;

  if (orders.length === 0)
    return (
      <div className="p-6 text-center flex flex-col items-center gap-2">
        <p className="text-gray-800 font-semibold text-lg">
          You haven't placed any orders yet!
        </p>
        <Link
          to="/"
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold text-black"
        >
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Past Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-md p-4 bg-gray-50 hover:shadow-sm transition"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">
                  Order ID:{" "}
                  <span className="font-mono text-gray-800">{order._id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Placed on:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-3 md:mt-0">
                <Link
                  to={`/order/${order._id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View Details →
                </Link>
              </div>
            </div>

            {/* Order Info Summary */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-700 gap-2">
              <div className="flex items-center gap-1">
                <Package size={16} />
                <span>{order.orderItems.length} items</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee size={16} />
                <span className="font-medium">
                  ₹{order.totalPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>
                  {order.isDelivered ? (
                    <span className="text-green-600 font-medium">Delivered</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      In Progress
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
