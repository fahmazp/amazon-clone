import Product from "../models/Product.js";

// Fetch all products with search, category filter, price sorting, and pagination
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

    const keyword = req.query.keyword && req.query.keyword.trim() !== ""
      ? {
          $or: [
            { name: { $regex: req.query.keyword.trim(), $options: "i" } },
            { description: { $regex: req.query.keyword.trim(), $options: "i" } },
            { brand: { $regex: req.query.keyword.trim(), $options: "i" } },
          ],
        }
      : {};

    const category =
      req.query.category && req.query.category.toLowerCase() !== "all"
        ? { category: { $regex: `^${req.query.category.trim()}$`, $options: "i" } }
        : {};

    const filter = { ...keyword, ...category };

    let sortQuery = { createdAt: -1 };
    if (req.query.sort === "price_asc") {
      sortQuery = { price: 1 };
    } else if (req.query.sort === "price_desc") {
      sortQuery = { price: -1 };
    } else if (req.query.sort === "rating") {
      sortQuery = { rating: -1 };
    } else if (req.query.sort === "newest") {
      sortQuery = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(filter);
    const query = Product.find(filter).sort(sortQuery);

    if (limit > 0) {
      query.skip((page - 1) * limit).limit(limit);
    }

    const products = await query;

    res.json({
      products,
      page,
      pages: limit > 0 ? Math.ceil(totalProducts / limit) || 1 : 1,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, image, brand, category, description, price, countInStock } = req.body;

    const product = new Product({
      name,
      image,
      brand,
      category,
      description,
      price: Number(price) || 0,
      countInStock: Number(countInStock) || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, image, brand, category, description, price, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.image = image !== undefined ? image : product.image;
      product.brand = brand !== undefined ? brand : product.brand;
      product.category = category !== undefined ? category : product.category;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;

      const updated = await product.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
