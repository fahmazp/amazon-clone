import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "@/api/cartAPI";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        setCart(data?.items || []);
      } catch (err) {
        console.error("Cart fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const addItem = (item) => setCart((prev) => [...prev, item]);
  const removeItem = (productId) =>
    setCart((prev) => prev.filter((i) => i.product._id !== productId));

  return (
    <CartContext.Provider value={{ cart, setCart, addItem, removeItem, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
