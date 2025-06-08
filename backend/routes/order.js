const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Dish = require("../models/dish");
const User = require("../models/user");
const Cart = require("../models/cart");
const { validateToken } = require("../JWT");

router.post("/place-order", validateToken, async (req, res) => {
  try {
    const { userId, deliveryDetails, items, discount = 0 } = req.body;

    if (!userId || !deliveryDetails || !items || !items.length) {
      return res.status(400).json({ message: "Incomplete order data." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const dish = await Dish.findById(item.dishId);
      if (!dish) return res.status(404).json({ message: "Dish not found." });

      const disc = dish.disc_per || 0;
      const discountedPrice = dish.price - (dish.price * disc) / 100;
      const itemTotal = discountedPrice * item.quantity;

      totalAmount += itemTotal;

      processedItems.push({
        dishId: dish._id,
        quantity: item.quantity,
        priceAtPurchase: discountedPrice,
      });
    }

    const finalAmount = totalAmount - (totalAmount * discount) / 100;

    const newOrder = new Order({
      user: user._id,
      items: processedItems,
      deliveryDetails,
      discount,
      totalAmount: finalAmount,
    });

    await newOrder.save();

    await Cart.deleteMany({ userId: user._id });

    res.status(201).json({
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
