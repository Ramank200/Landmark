const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.get("/", auth, cartController.getCart);
router.post("/add", auth, cartController.addToCart);
router.patch("/update", auth, cartController.updateCartItem);
router.delete("/remove", auth, cartController.removeFromCart);
router.post("/clear", auth, cartController.clearCart);

module.exports = router;
