const mongoose = require("mongoose");
const User = require("../user");
const bcrypt = require("bcryptjs");

mongoose
  .connect("mongodb://127.0.0.1:27017/Restaurant")
  .then(() => console.log("Mongoose connected successfully"))
  .catch((error) => console.log(error));

const hashed = bcrypt.hash("admin123", 10);
const admin = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: hashed,
    isAdmin: true,
  },
];

const seedDb = async () => {
  try {
    const hashed = await bcrypt.hash("admin123", 10);

    const admin = {
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      isAdmin: true,
    };
    await User.insertOne(admin);

    console.log("Admin user seeded successfully.");
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDb();
