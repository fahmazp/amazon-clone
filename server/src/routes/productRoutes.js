import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadProductImage } from "../controllers/uploadController.js";
import {
  addProductReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/getProducts", getProducts);
router.get("/:id", getProductById);
router.get("/getProduct/:id", getProductById);

// Protected user routes
router.post("/:id/reviews", authUser, addProductReview);
router.post("/addReview/:id", authUser, addProductReview);

// Admin-only product mutation routes
router.post("/", authUser, isAdmin, createProduct);
router.post("/createProduct", authUser, isAdmin, createProduct);

router.put("/:id", authUser, isAdmin, updateProduct);
router.put("/updateProduct/:id", authUser, isAdmin, updateProduct);

router.delete("/:id", authUser, isAdmin, deleteProduct);
router.delete("/deleteProduct/:id", authUser, isAdmin, deleteProduct);

// Admin-only Cloudinary image upload
router.post("/upload", authUser, isAdmin, upload.single("image"), uploadProductImage);

export { router as productRouter };
