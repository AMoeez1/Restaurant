const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_code: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing" , "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

function generateOrderCode(name = "ORD") {
  const cleanName = name.replace(/\s+/g, "").toUpperCase();
  const start = cleanName.substring(0, 2);
  const end =
    cleanName.length > 2
      ? cleanName.substring(cleanName.length - 2)
      : cleanName;

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${start}${end}${randomNum}`;
}

orderSchema.pre("save", async function (next) {
  if (!this.order_code) {
    let code;
    let isUnique = false;

    const user = await mongoose.models.User.findById(this.user).select("name");

    const name = user?.name || "ORD";

    while (!isUnique) {
      code = generateOrderCode(name);
      const existing = await mongoose.models.Order.findOne({
        order_code: code,
      });
      if (!existing) isUnique = true;
    }

    this.order_code = code;
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
