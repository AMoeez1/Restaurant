const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dish', 
    required: true,
  },
  dish_code: {type: String, required: true},
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
