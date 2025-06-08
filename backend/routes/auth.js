const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const fs = require("fs");

const User = require("../models/user");
const upload = require("../middlwares/upload");
const { createToken, validateToken } = require("../JWT");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email,
      password: hashed,
    });
    await user.save();

    res.status(201).json({
      message: "Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(401).json({
      message: "Failed to registered!",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existsUser = await User.findOne({ email }).select('+password');
    if (!existsUser) {
      return res
        .status(409)
        .json({ message: "Can not find account with this email" });
    }
    const matchedPass = await bcrypt.compare(password, existsUser.password);

    if (!matchedPass) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const accessToken = createToken(existsUser);
    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.status(201).json({
      message: "Logged In Successfully",
      user: {
        id: existsUser._id,
        name: existsUser.name,
        email: existsUser.email,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Server error", error: error.message });
  }
});

router.get("/profile", validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      authenticated: true,
      message: "User is authenticated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/profile", validateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(409)
        .send({ message: "Name and email fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(409).send({ message: "Error Updating User!" });
    }

    res.json({
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("access-token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.send({ message: "Logged Out Successfully" });
});

router.get("/check-auth", validateToken, (req, res) => {
  res.json({ isAuthenticated: true });
});

router.post(
  "/upload-avatar",
  validateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }

      user.avatar = req.file.path;
      await user.save();

      res.json({
        message: "Image uploaded successfully",
        avatar: user.avatar,
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  }
);

router.get("/get-user-detail", validateToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ isAuthenticated: false });
  }

  res.json({
    isAuthenticated: true,
    user: {
      _id: req.user.id,
      email: req.user.email,
    },
  });
});


module.exports = router;
