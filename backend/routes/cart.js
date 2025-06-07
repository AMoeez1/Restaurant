const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Cart = require("../models/cart");

router.post("/add-cart", async (req, res) => {
  try {
    const { userId, dishId, dish_code, quantity = 1 } = req.body;
    if (!userId || !dishId || !dish_code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.dishId.toString() === dishId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        dishId,
        dish_code,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    return res.status(409).json(err);
  }
});

router.get('/get-cart-item/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(user_id) }).populate('items.dishId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.get("/test-route", (req, res) => {
  res.json({ message: "Test route working!" });
});


module.exports = router;
