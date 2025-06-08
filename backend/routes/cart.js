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

router.post('/update-cart/:user_id/:dish_id', async (req, res) => {
  try {
    const { user_id, dish_id } = req.params;
    const { quantity } = req.body; 

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ userId: user_id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for user" });
    }

    const itemIndex = cart.items.findIndex(item => item.dishId.toString() === dish_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Dish not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({ message: "Server error", error: err });
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

router.delete("/delete-cart/:userId/:dishId", async (req, res) => {
  const { userId, dishId } = req.params;

  try {
    const userCart = await Cart.findOne({ userId });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    userCart.items = userCart.items.filter(
      (item) => item.dishId.toString() !== dishId
    );

    await userCart.save();
    res.status(200).json({ message: "Item removed from cart", cart: userCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
