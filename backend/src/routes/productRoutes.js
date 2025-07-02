const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const isSeller = require("../middleware/isSeller");

// Create a new product (seller only)
router.post("/", auth, isSeller, productController.createProduct);

// Get all products (paginated)
router.get("/", productController.getAllProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product (seller only, owner only)
router.patch("/:id", auth, isSeller, productController.updateProduct);

// Delete a product (seller only, owner only)
router.delete("/:id", auth, isSeller, productController.deleteProduct);

module.exports = router;
