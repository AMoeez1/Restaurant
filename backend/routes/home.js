const express = require("express");
const router = express.Router();

const Dish = require("../models/dish");

router.get("/dish", async (req, res) => {
  try {
    const dish = await Dish.find({ is_available: true });
    res.status(201).json(dish);
  } catch (err) {
    res.status(409).json({ message: "Error:".err });
  }
});

router.get("/dish/:dish_id", async (req, res) => {
  try {
    const { dish_id } = req.params;
    const dish = await Dish.findById(dish_id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error("Error fetching dish:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
