const mongoose = require("mongoose");
const { Schema } = mongoose;

const DishSchema = new Schema(
  {
    dish_code: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image_url: {
      type: String,
      default: null,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

function generateDishCode(name) {
  const cleanName = name.replace(/\s+/g, "").toUpperCase();

  const start = cleanName.substring(0, 2);
  const end =
    cleanName.length > 2
      ? cleanName.substring(cleanName.length - 2)
      : cleanName;

  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return start + end + randomNum;
}

DishSchema.pre("save", async function (next) {
  if (!this.dish_code && this.name) {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = generateDishCode(this.name);
      const existing = await mongoose.models.Dish.findOne({ dish_code: code });
      if (!existing) isUnique = true;
    }

    this.dish_code = code;
  }
  next();
});

module.exports = mongoose.model("Dish", DishSchema);
