const express = require("express");
const router = express.Router();

const Dish = require("../models/dish");

router.get("/dish", async (req, res) => {
  try {
    const dish = await Dish.find();
    res.status(201).json(dish);
  } catch (err) {
    res.status(409).json({ message: "Error:".err });
  }
});

router.get("/update-dish/:dish_id", async (req, res) => {
  const { dish_id } = req.params;
  const dish = await Dish.findById(dish_id);
  if (!dish) {
    return res.status(404).json({ error: "Dish not found" });
  }
  res.status(201).json(dish);
});

module.exports = router;
