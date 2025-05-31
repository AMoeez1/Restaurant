const express = require("express");
const router = express.Router();

const Dish = require("../../models/dish");
const { validateToken, verifyAdmin } = require("../../JWT");

router.post("/add-dish", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image_url,
      is_available,
      day_special,
      food_type,
      disc_per,
    } = req.body;

    const newDish = new Dish({
      name,
      description,
      price,
      image_url,
      is_available,
      day_special,
      food_type,
      disc_per,
    });

    const savedDish = await newDish.save();

    res.status(201).json({
      message: "Dish added successfully",
      dish: savedDish,
    });
  } catch (err) {
    console.error("Error while adding dish:", err.message, err.stack);
    res.status(500).json({ message: "Server error while adding dish" });
  }
});

router.get("/dishes", async (req, res) => {
  try {
    const dish = await Dish.find();
    res.status(201).json(dish);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching users" });
  }
});

module.exports = router;
