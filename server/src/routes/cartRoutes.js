import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  syncCart,
} from "../controllers/cartController.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/add-to-cart", authUser, addToCart);
router.get("/get-cart", authUser, getCart);
router.delete("/remove-from-cart/:productId", authUser, removeFromCart);
router.put("/update-cart/:productId", authUser, updateCartQuantity);
router.post("/sync", authUser, syncCart);

export { router as cartRouter };
