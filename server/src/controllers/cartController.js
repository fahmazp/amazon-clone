import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Helper to consolidate duplicate items by product ID
const deduplicateCartItems = (items) => {
  const map = new Map();
  for (const item of items) {
    const rawProd = item.product;
    const prodId = (rawProd?._id || rawProd)?.toString();
    if (!prodId) continue;

    if (map.has(prodId)) {
      map.get(prodId).quantity += Number(item.quantity) || 1;
    } else {
      map.set(prodId, {
        product: rawProd,
        quantity: Number(item.quantity) || 1,
      });
    }
  }
  return Array.from(map.values());
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity: Number(quantity) }] });
    } else {
      // Clean up any existing duplicates first
      cart.items = deduplicateCartItems(cart.items);

      const itemIndex = cart.items.findIndex(
        (item) => (item.product?._id || item.product)?.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });

    // Clean up duplicates if present in legacy records
    const originalLength = cart.items.length;
    cart.items = deduplicateCartItems(cart.items);
    if (cart.items.length !== originalLength) {
      await cart.save();
    }

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const targetId = req.params.productId.toString();
    cart.items = cart.items.filter(
      (item) => (item.product?._id || item.product)?.toString() !== targetId
    );

    await cart.save();
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = deduplicateCartItems(cart.items);

    const targetId = productId.toString();
    const itemIndex = cart.items.findIndex(
      (item) => (item.product?._id || item.product)?.toString() === targetId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    } else {
      // Deduplicate existing cart items
      cart.items = deduplicateCartItems(cart.items);
    }

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prodId = (item.productId || (item.product && item.product._id) || item.product)?.toString();
        const qty = Math.max(1, Number(item.quantity) || 1);
        if (!prodId) continue;

        const product = await Product.findById(prodId);
        if (!product) continue;

        const existingIndex = cart.items.findIndex(
          (ci) => (ci.product?._id || ci.product)?.toString() === prodId
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity = Math.min(
            cart.items[existingIndex].quantity + qty,
            product.countInStock || 99
          );
        } else {
          cart.items.push({
            product: prodId,
            quantity: Math.min(qty, product.countInStock || 99),
          });
        }
      }

      // Final deduplication pass to guarantee uniqueness
      cart.items = deduplicateCartItems(cart.items);
      await cart.save();
    }

    const populatedCart = await Cart.findOne({ user: userId }).populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
