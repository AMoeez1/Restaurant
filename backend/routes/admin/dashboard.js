const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const { validateToken, verifyAdmin } = require("../../JWT");

router.get("/dashboard", validateToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});


module.exports = router;
