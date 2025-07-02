const Product = require("../models/Product");

// Create a new product (seller only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, onSale, salePrice } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }
    const product = new Product({
      name,
      description,
      price,
      onSale: !!onSale,
      salePrice: onSale ? salePrice : undefined,
      seller: req.user._id,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products (paginated)
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find()
      .populate("seller", "name email")
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await Product.countDocuments();
    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a product (seller only, owner only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }
    const { name, description, price, onSale, salePrice } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (typeof onSale === "boolean") product.onSale = onSale;
    if (onSale && salePrice) product.salePrice = salePrice;
    if (!onSale) product.salePrice = undefined;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product (seller only, owner only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
