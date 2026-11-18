import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "Cash on Delivery" } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.address?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.postalCode?.trim() ||
      !shippingAddress.country?.trim() ||
      !shippingAddress.phone?.trim()
    ) {
      return res.status(400).json({ message: "Please provide a complete shipping address including phone number" });
    }

    const digitsOnly = shippingAddress.phone.replace(/[\s\-+]/g, "");
    if (!/^\d{10,15}$/.test(digitsOnly)) {
      return res.status(400).json({ message: "Please enter a valid phone number (10–15 digits)" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items
      .filter((item) => item.product)
      .map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id,
      }));

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid products found in cart" });
    }

    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.01 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await order.save();
    await Cart.deleteOne({ user: req.user._id }); // Clear cart after order is placed

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure only order owner or admin can view
    const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
