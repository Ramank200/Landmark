const Bundle = require("../models/Bundle");
const Product = require("../models/Product");

// Helper to calculate bundle discount
async function calculateBundleDiscount(productIds) {
  // Fetch all products
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length < 2) {
    throw new Error("A bundle must contain at least 2 different products.");
  }
  let total = 0;
  products.forEach((p) => {
    if (p.onSale && p.salePrice) {
      total += p.salePrice;
    } else {
      total += p.price;
    }
  });
  const discount = total * 0.1;
  const discountedPrice = +(total - discount).toFixed(2);
  return { discountedPrice, products };
}

// Create a new bundle
exports.createBundle = async (req, res) => {
  try {
    const { name, products: productIds } = req.body;
    if (!name || !productIds || !Array.isArray(productIds)) {
      return res
        .status(400)
        .json({ message: "Name and products array are required." });
    }

    const { discountedPrice, products } = await calculateBundleDiscount(
      productIds
    );

    const bundle = new Bundle({
      name,
      products: products.map((p) => p._id),
      seller: req.user._id,
      discountedPrice,
    });
    await bundle.save();
    res.status(201).json(bundle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all bundles (paginated)
exports.getAllBundles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let filter = {};
    if (req.query.seller === "me" && req.user && req.user._id) {
      filter.seller = req.user._id;
    }
    const bundles = await Bundle.find(filter)
      .populate("products")
      .populate("seller", "name email")
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await Bundle.countDocuments(filter);
    res.status(200).json({
      bundles,
      page,
      totalPages: Math.ceil(total / limit),
      totalBundles: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a bundle (seller only)
exports.updateBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: "Bundle not found" });
    // Only the seller who owns the bundle can update
    if (bundle.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this bundle" });
    }
    const { name, products: productIds } = req.body;
    if (name) bundle.name = name;
    if (productIds && Array.isArray(productIds)) {
      // Recalculate discount
      const { discountedPrice, products } = await calculateBundleDiscount(
        productIds
      );
      bundle.products = products.map((p) => p._id);
      bundle.discountedPrice = discountedPrice;
    }
    await bundle.save();
    res.status(200).json(bundle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a bundle (seller only)
exports.deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: "Bundle not found" });
    // Only the seller who owns the bundle can delete
    if (bundle.seller.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this bundle" });
    }
    await bundle.deleteOne();
    res.status(200).json({ message: "Bundle deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Check bundle discount
exports.checkDiscount = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id).populate("products");
    if (!bundle) return res.status(404).json({ message: "Bundle not found" });
    // Recalculate discount in case products have changed
    const { discountedPrice } = await calculateBundleDiscount(
      bundle.products.map((p) => p._id)
    );
    res.status(200).json({ discountedPrice });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
