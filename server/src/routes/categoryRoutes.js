import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authUser } from "../middlewares/authUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Protected Admin CRUD
router.post("/", authUser, isAdmin, createCategory);
router.put("/:id", authUser, isAdmin, updateCategory);
router.delete("/:id", authUser, isAdmin, deleteCategory);

export { router as categoryRouter };
