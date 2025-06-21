const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const Order = require("../../models/Order");
const { validateToken, verifyAdmin } = require("../../JWT");

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.dishId", "name price image_url")
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments();

    res.status(200).json({orders,count});
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.get('/reservations', async (req, res) => {
  try {
    const reservation = await Reservation.find().populate('user').populate('table');
    res.status(200).json(reservation)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router;
