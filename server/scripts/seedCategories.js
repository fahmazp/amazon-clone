/**
 * seedCategories.js
 * ------------------
 * Pre-populates the categories collection with default store categories.
 * Safe to re-run — skips any category that already exists (upsert by name).
 *
 * Usage:
 *   cd server
 *   node scripts/seedCategories.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

// ─── Inline Category schema (avoids circular import issues) ──────────────────
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

// ─── Default categories (matches existing product strings on the home page) ───
const DEFAULT_CATEGORIES = [
  { name: "Electronics",  description: "Gadgets, devices, and consumer electronics" },
  { name: "Mobiles",      description: "Smartphones and mobile accessories" },
  { name: "Home",         description: "Home appliances, décor, and furniture" },
  { name: "Fashion",      description: "Clothing, footwear, and accessories" },
  { name: "Appliances",   description: "Kitchen and home appliances" },
  { name: "Books",        description: "Books, e-books, and educational material" },
  { name: "Beauty",       description: "Skincare, cosmetics, and personal care" },
];

// ─── Seed logic ───────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();

  console.log("\n🌱  Seeding categories...\n");

  let created = 0;
  let skipped = 0;

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await Category.findOne({
      name: { $regex: `^${cat.name}$`, $options: "i" },
    });

    if (existing) {
      console.log(`  ⏭  Skipped  — "${cat.name}" already exists`);
      skipped++;
    } else {
      await Category.create(cat);
      console.log(`  ✅  Created  — "${cat.name}"`);
      created++;
    }
  }

  console.log(`\n✔  Done — ${created} created, ${skipped} skipped.\n`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
