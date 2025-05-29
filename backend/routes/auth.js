const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");
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
    const existsUser = await User.findOne({ email });
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

router.get("/logout", (req, res) => {
  res.cookie("access-token", "", {
    maxAge: 0,
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.send({message: 'Logged Out Successfully'});
});

router.get('/check-auth', validateToken ,(req, res) => {
  res.json({ isAuthenticated: true });
})


module.exports = router;
