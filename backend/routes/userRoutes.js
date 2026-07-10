const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");


const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;