const express = require("express");
const router = express.Router();

const Dish = require("../../models/dish");
const dish_image = require('../../middlwares/dish_image') 
const { validateToken, verifyAdmin } = require("../../JWT");

router.post("/add-dish", dish_image.single("image"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      is_available,
      day_special,
      food_type,
      disc_per,
    } = req.body;

    const image_url = req.file ? req.file.path : null;

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

router.get("/get-dish/:dish_id", async (req, res) => {
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


router.delete('/delete-dish/:dish_id', async (req, res) => {
  const {dish_id} = req.params;
  const dish = await Dish.findByIdAndDelete(dish_id)

  if(!dish_id) {
    return res.status(404).json({message: 'No Dish Found'})
  }
  if(!dish) {
    return res.status(404).json({message: 'Error Deleting Dish'})
  }

  return res.status(201).json({message :"Dish Delete Successfully"})
})

module.exports = router;
