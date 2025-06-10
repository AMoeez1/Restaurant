const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  date: { type: Date, required: true },
  from: { type: Date, required: true },
  till: { type: Date, required: true }, 
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;