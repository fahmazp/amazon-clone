import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getCart, removeFromCart, updateCartQuantity } from "@/api/cartAPI";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, setCart, loading } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data.items);
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };
    fetchCart();
  }, [setCart]);

  // total price
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(total);
    setTotalItems(itemsCount);
  }, [cart]);

  // Remove item
  // const handleRemove = async (productId) => {
  //   try {
  //     setIsUpdating(true);
  //     const updatedCart = await removeFromCart(productId);
  //     setCart(updatedCart.items);
  //   } catch (err) {
  //     toast.error(err?.message || "Failed to remove item");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };
  const handleRemove = async (productId) => {
  try {
    setUpdatingId(productId);
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart.items);
    toast.success("Item removed from cart");
  } catch (err) {
    toast.error(err?.message || "Failed to remove item");
  } finally {
    setUpdatingId(null);
  }
};

  // Update cart
  const handleIncrease = async (id, currentQty) => {
    try {
      const updatedCart = await updateCartQuantity(id, currentQty + 1);
      setCart(updatedCart.items);
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    }
  };

  const handleDecrease = async (id, currentQty) => {
    try {
      const updatedCart = await updateCartQuantity(id, currentQty - 1);
      setCart(updatedCart.items);
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    }
  };

  const handleShareProduct = (productId) => {
    try {
      const productLink = `${window.location.origin}/product/${productId}`;
      navigator.clipboard.writeText(productLink);
      toast("Product link copied!");
    } catch (err) {
      toast.error(err?.message || "Failed to copy link");
    }
};


  if (loading)
    return <div className="p-6 text-center">Loading your cart...</div>;
  if (cart.length === 0)
    return (
      <div className="p-6 lg:py-10 text-center flex flex-col items-center gap-2">
        <p className="text-gray-800 md:text-lg font-semibold">
          Your cart is empty!
        </p>
        <Link
          to="/"
          className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-sm text-black px-2 py-1.5 rounded font-semibold transition"
        >
          Continue Shopping
          <ShoppingBag className="w-3.5 h-3.5" />
        </Link>
      </div>
    );

  return (

    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
          >
            <div className="flex items-center gap-4">

        <Link to={`/product/${item.product._id}`} className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-contain border rounded-md"
              />


              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.product.price} x {item.quantity}
                </p>
                <p className="text-sm font-semibold">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => handleDecrease(item.product._id, item.quantity)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                -
              </button>
              <span className="px-2 font-semibold">{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.product._id, item.quantity)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button
                onClick={() => handleShareProduct(item.product._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded font-medium"
              >
                Share
              </button>
              <button
                onClick={() => handleRemove(item.product._id)}
                disabled={updatingId === item.product._id}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                {updatingId === item.product._id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Subtotal ({totalItems} items):&nbsp;
          <span className="font-bold">₹{totalPrice.toFixed(2)}</span> 
        </h3>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-yellow-400 hover:bg-yellow-400/75 px-4 py-2 rounded-sm font-semibold"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

export default CartPage;
