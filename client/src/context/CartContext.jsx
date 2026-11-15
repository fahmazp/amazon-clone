import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartQuantity as updateCartQuantityAPI,
  syncCartAPI,
} from "@/api/cartAPI";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Helper to consolidate duplicate items by product ID
const deduplicateItems = (items) => {
  const map = new Map();
  for (const item of items) {
    const prodId = (item.product?._id || item.product)?.toString();
    if (!prodId) continue;
    if (map.has(prodId)) {
      map.get(prodId).quantity += Number(item.quantity) || 1;
    } else {
      map.set(prodId, { ...item, quantity: Number(item.quantity) || 1 });
    }
  }
  return Array.from(map.values());
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and synchronize cart based on authentication state
  useEffect(() => {
    if (authLoading) return;

    const initCart = async () => {
      setLoading(true);
      try {
        const storedGuestCart = localStorage.getItem("guest_cart");
        let guestItems = [];
        try {
          guestItems = storedGuestCart ? JSON.parse(storedGuestCart) : [];
        } catch (e) {
          guestItems = [];
        }

        guestItems = deduplicateItems(guestItems);

        if (user) {
          // If user is logged in, sync any guest items with MongoDB
          if (guestItems.length > 0) {
            const syncPayload = guestItems.map((item) => ({
              productId: (item.product?._id || item.product)?.toString(),
              quantity: item.quantity,
            }));
            const data = await syncCartAPI(syncPayload);
            const items = deduplicateItems(data?.items || []);
            setCart(items);
            localStorage.removeItem("guest_cart");
          } else {
            const data = await getCart();
            const items = deduplicateItems(data?.items || []);
            setCart(items);
          }
        } else {
          // Guest user: load from local storage
          setCart(guestItems);
        }
      } catch (err) {
        console.error("Cart initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, [user, authLoading]);

  // Save guest cart to localStorage whenever cart state changes while logged out
  const saveGuestCart = (newCart) => {
    const cleanCart = deduplicateItems(newCart);
    setCart(cleanCart);
    if (!user) {
      localStorage.setItem("guest_cart", JSON.stringify(cleanCart));
    }
  };

  // Add item to cart
  const addToCart = async (productOrId, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const productId = (typeof productOrId === "object" ? productOrId._id : productOrId)?.toString();
    const productObj = typeof productOrId === "object" ? productOrId : null;

    if (!productId) return;

    if (user) {
      try {
        const data = await addToCartAPI(productId, qty);
        const clean = deduplicateItems(data?.items || []);
        setCart(clean);
        return { items: clean };
      } catch (err) {
        console.error("Failed to add to backend cart:", err);
        throw err;
      }
    } else {
      // Guest mode
      const updated = deduplicateItems([...cart]);
      const index = updated.findIndex((i) => (i.product?._id || i.product)?.toString() === productId);

      if (index > -1) {
        updated[index].quantity += qty;
      } else {
        updated.push({
          product: productObj || { _id: productId },
          quantity: qty,
        });
      }

      saveGuestCart(updated);
      return { items: updated };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    const targetId = productId?.toString();

    if (user) {
      try {
        const data = await updateCartQuantityAPI(targetId, qty);
        const clean = deduplicateItems(data?.items || []);
        setCart(clean);
        return { items: clean };
      } catch (err) {
        console.error("Failed to update backend quantity:", err);
        throw err;
      }
    } else {
      let updated = deduplicateItems([...cart]);
      if (qty <= 0) {
        updated = updated.filter((i) => (i.product?._id || i.product)?.toString() !== targetId);
      } else {
        const index = updated.findIndex((i) => (i.product?._id || i.product)?.toString() === targetId);
        if (index > -1) {
          updated[index].quantity = qty;
        }
      }
      saveGuestCart(updated);
      return { items: updated };
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    const targetId = productId?.toString();

    if (user) {
      try {
        const data = await removeFromCartAPI(targetId);
        const clean = deduplicateItems(data?.items || []);
        setCart(clean);
        return { items: clean };
      } catch (err) {
        console.error("Failed to remove from backend cart:", err);
        throw err;
      }
    } else {
      const updated = cart.filter((i) => (i.product?._id || i.product)?.toString() !== targetId);
      saveGuestCart(updated);
      return { items: updated };
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    if (!user) {
      localStorage.removeItem("guest_cart");
    }
  };

  // Computations
  const cartCount = cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const itemsPrice = cart.reduce((acc, item) => {
    const price = Number(item.product?.price) || 0;
    return acc + price * (Number(item.quantity) || 0);
  }, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : itemsPrice > 0 ? 10 : 0;
  const taxPrice = Number((0.01 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
