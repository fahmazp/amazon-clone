import express from "express";
import { createOrder, getMyOrders, getOrderById } from "../controllers/orderController.js";
import { authUser } from "../middlewares/authUser.js";


const router = express.Router();

router.post("/create-order", authUser, createOrder);
router.get("/myorders", authUser, getMyOrders);
router.get("/get-orders/:id", authUser, getOrderById);

export { router as orderRouter };
