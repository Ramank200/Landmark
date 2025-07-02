const express = require("express");
const router = express.Router();
const bundleController = require("../controllers/bundleController");
const auth = require("../middleware/auth");
const isSeller = require("../middleware/isSeller");

// Create a new bundle (seller only)
router.post("/", auth, isSeller, bundleController.createBundle);

// Get all bundles (paginated)
router.get("/", bundleController.getAllBundles);

// Update a bundle (seller only)
router.patch("/:id", auth, isSeller, bundleController.updateBundle);

// Delete a bundle (seller only)
router.delete("/:id", auth, isSeller, bundleController.deleteBundle);

// Check bundle discount
router.get("/:id/checkDiscount", bundleController.checkDiscount);

module.exports = router;
