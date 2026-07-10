const User = require("../models/User");

// GET ALL USERS - ADMIN ONLY
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// UPDATE USER ROLE - ADMIN ONLY
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// DELETE USER - ADMIN ONLY
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user?._id?.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete own account",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};