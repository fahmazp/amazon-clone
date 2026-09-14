import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const newProducts = [
  {
    name: "Fjallravenaaa - Foldsack No. 1 Backpack",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    brand: "Fjallraven",
    category: "Fashion",
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
    price: 1099,
    countInStock: 120,
    rating: 4.8,
    numReviews: 120,
  },
  {
    name: "Mens Casual Premium Slim Fit T-Shirts",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.jpg",
    brand: "Generic",
    category: "Fashion",
    description: "Slim-fitting style, contrast raglan sleeve, three-button henley placket.",
    price: 499,
    countInStock: 259,
    rating: 4.1,
    numReviews: 259,
  },
  {
    name: "Mens Cotton Jacket",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    brand: "Great Outerwear",
    category: "Fashion",
    description: "Great outerwear jackets for spring, autumn, and winter.",
    price: 2999,
    countInStock: 50,
    rating: 4.7,
    numReviews: 500,
  },
  {
    name: "Mens Casual Slim Fit",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    brand: "Generic",
    category: "Fashion",
    description: "The color could be slightly different between on the screen and in practice.",
    price: 399,
    countInStock: 430,
    rating: 4.1,
    numReviews: 430,
  },
  {
    name: "John Hardy Women's Legends Naga Bracelet",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    brand: "John Hardy",
    category: "Fashion",
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon.",
    price: 6950,
    countInStock: 10,
    rating: 4.6,
    numReviews: 400,
  },
  {
    name: "Solid Gold Petite Micropave",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    brand: "Gold Jewels",
    category: "Fashion",
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days.",
    price: 1680,
    countInStock: 70,
    rating: 4.9,
    numReviews: 70,
  },
  {
    name: "WD 2TB Elements Portable External Hard Drive",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    brand: "WD",
    category: "Electronics",
    description: "USB 3.0 and USB 2.0 Compatibility. Fast data transfers.",
    price: 5499,
    countInStock: 203,
    rating: 4.3,
    numReviews: 203,
  },
  {
    name: "SanDisk SSD PLUS 1TB Internal SSD",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    brand: "SanDisk",
    category: "Electronics",
    description: "Easy upgrade for faster boot up, shutdown, application load and response.",
    price: 8999,
    countInStock: 40,
    rating: 4.9,
    numReviews: 470,
  },
  {
    name: "Acer SB220Q bi 21.5 inches Full HD Monitor",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    brand: "Acer",
    category: "Electronics",
    description: "21.5 inches Full HD (1920 x 1080) widescreen IPS display.",
    price: 12599,
    countInStock: 80,
    rating: 4.9,
    numReviews: 250,
  },
  {
    name: "Samsung 49-Inch CHG90 144Hz Monitor",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    brand: "Samsung",
    category: "Electronics",
    description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side.",
    price: 85999,
    countInStock: 15,
    rating: 4.2,
    numReviews: 140,
  },
  {
    name: "HP Laptop",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    brand: "HP",
    category: "Electronics",
    description: "HP Laptop",
    price: 12599,
    countInStock: 80,
    rating: 4.9,
    numReviews: 250,
  },
  {
    name: "Dell Laptop",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    brand: "Dell",
    category: "Electronics",
    description: "Dell Laptop",
    price: 12599,
    countInStock: 80,
    rating: 4.9,
    numReviews: 250,
  },
  {
    name: "Dell Laptop",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    brand: "Dell",
    category: "Electronics",
    description: "Dell Laptop",
    price: 12599,
    countInStock: 80,
    rating: 4.9,
    numReviews: 250,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products cleared");

    // Insert new mock products
    await Product.insertMany(newProducts);
    console.log("Products inserted successfully!");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
