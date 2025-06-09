const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  isVIP: { type: Boolean, default: false },
});

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  seats: { 
    type: [seatSchema], 
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 1;
      },
      message: 'A table must have at least one seat.',
    }
  },
  isAvailable: { type: Boolean, default: true },
  reservedAt: { type: Date, default: null },
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
});

tableSchema.pre('save', function(next) {
  if (this.reservedBy && this.reservedAt) {
    this.seats.forEach(seat => {
      seat.isOccupied = true;
    });
    this.isAvailable = false;
  } else {
    this.isAvailable = this.seats.every(seat => !seat.isOccupied);
  }
  next();
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
