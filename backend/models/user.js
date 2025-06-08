const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name must be less than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  avatar: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: false, 
    trim: true,
    match: [/^\+?[0-9\s\-]{7,15}$/, "Please enter a valid phone number"],
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200,
  },
  city: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100,
  },
  postalCode: {
    type: String,
    required: false,
    trim: true,
    maxlength: 20,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
