const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

router.post("/get-reservation", async (req, res) => {
  try {
    const { userId, tableId, date, from, till } = req.body;

    if (!userId || !tableId || !date || !from || !till) {
      return res.status(400).json({ message: "Incomplete reservation details." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Table not found." });

    const reservationDate = new Date(date);
    const fromTime = new Date(`${date}T${from}`);
    const tillTime = new Date(`${date}T${till}`);

    if (fromTime >= tillTime) {
      return res.status(400).json({ message: "'from' time must be before 'till' time." });
    }

    const conflict = await Reservation.findOne({
      table: tableId,
      date: reservationDate,
      $or: [
        { from: { $lt: tillTime }, till: { $gt: fromTime } },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: "Table is already reserved for this time slot." });
    }

    const newReservation = new Reservation({
      user: user._id,
      table: table._id,
      date: reservationDate,
      from: fromTime,
      till: tillTime,
    });

    await newReservation.save();

    return res.status(201).json({ message: "Reservation successful.", reservation: newReservation });
  } catch (error) {
    console.error("Reservation error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
