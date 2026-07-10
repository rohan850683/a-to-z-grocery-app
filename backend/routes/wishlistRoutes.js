const express = require("express");
const {
  getMyWishlist,
  toggleWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getMyWishlist);
router.post("/toggle", protect, toggleWishlist);

module.exports = router;