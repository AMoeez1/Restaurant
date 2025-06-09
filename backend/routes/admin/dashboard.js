const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const Order = require("../../models/Order");
const { validateToken, verifyAdmin } = require("../../JWT");

// router.get("/dashboard", validateToken, verifyAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select("-password");

//     res.status(200).json({users, orders});
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ message: "Server error fetching users" });
//   }
// });

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.dishId", "name price")
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments();

    res.status(200).json({orders,count});
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
