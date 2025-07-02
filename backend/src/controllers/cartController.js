const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Bundle = require("../models/Bundle");

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.bundle");
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { type, product, bundle, quantity } = req.body;
    if (
      !type ||
      (type === "product" && !product) ||
      (type === "bundle" && !bundle)
    ) {
      return res.status(400).json({ message: "Invalid item data." });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    // Check if item already exists
    const idx = cart.items.findIndex(
      (item) =>
        item.type === type &&
        ((type === "product" && item.product?.toString() === product) ||
          (type === "bundle" && item.bundle?.toString() === bundle))
    );
    if (idx !== -1) {
      cart.items[idx].quantity += quantity || 1;
    } else {
      cart.items.push({ type, product, bundle, quantity: quantity || 1 });
    }
    await cart.save();
    // Re-fetch and populate
    cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.bundle");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity of an item
exports.updateCartItem = async (req, res) => {
  try {
    const { type, product, bundle, quantity } = req.body;
    if (!type || (!product && !bundle) || !quantity) {
      return res.status(400).json({ message: "Invalid item data." });
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    const idx = cart.items.findIndex(
      (item) =>
        item.type === type &&
        ((type === "product" && item.product?.toString() === product) ||
          (type === "bundle" && item.bundle?.toString() === bundle))
    );
    if (idx === -1)
      return res.status(404).json({ message: "Item not found in cart." });
    cart.items[idx].quantity = quantity;
    await cart.save();
    // Re-fetch and populate
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.bundle");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { type, product, bundle } = req.body;
    if (!type || (!product && !bundle)) {
      return res.status(400).json({ message: "Invalid item data." });
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.type === type &&
          ((type === "product" && item.product?.toString() === product) ||
            (type === "bundle" && item.bundle?.toString() === bundle))
        )
    );
    await cart.save();
    // Re-fetch and populate
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.bundle");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    cart.items = [];
    await cart.save();
    // Re-fetch and populate
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")
      .populate("items.bundle");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
