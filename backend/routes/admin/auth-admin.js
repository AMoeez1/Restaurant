const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { createToken, validateToken, verifyAdmin } = require("../../JWT");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +isAdmin");
    if (!user) {
      return res.status(409).json({ message: "Invalid admin credentials!" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Not an admin!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).json({ message: "Invalid admin credentials!" });
    }

    const accessToken = createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res.status(200).json({
      message: "Admin Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/check-admin", validateToken, verifyAdmin, async (req, res) => {
    return res.status(200).json({ isAdmin: true });
});

module.exports = router;
