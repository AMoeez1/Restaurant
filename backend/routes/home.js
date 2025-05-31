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

router.put("/update-dish/:dish_id", async (req, res) => {
  try {
    const { dish_id } = req.params;
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

    const updatedDish = await Dish.findByIdAndUpdate(
      dish_id,
      {
        name,
        description,
        price,
        image_url,
        is_available,
        day_special,
        food_type,
        disc_per,
      },
      { new: true }
    );

    if (!updatedDish) {
      return res.status(404).send({ message: "Error Updating Dish!" });
    }

    res.json({
      message: "Dish Updated Successfully",
      user: updatedDish,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
