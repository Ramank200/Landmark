const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discountedPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bundle", bundleSchema);
