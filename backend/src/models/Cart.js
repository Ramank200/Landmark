const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["product", "bundle"], required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  bundle: { type: mongoose.Schema.Types.ObjectId, ref: "Bundle" },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
