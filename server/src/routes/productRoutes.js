import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { addProductReview, createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";


const router = express.Router();

// Public routes
router.get("/getProducts", getProducts);
router.get("/getProduct/:id", getProductById);

// Protected routes (for adding/editing/deleting products)
router.post("/createProduct", authUser, createProduct);
router.put("/updateProduct/:id", authUser, updateProduct);
router.delete("/deleteProduct/:id", authUser, deleteProduct);

// router.post("/upload", authUser, upload.single("image"), uploadProductImage);
router.post("/addReview/:id", authUser, addProductReview);

export { router as productRouter };
