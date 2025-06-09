const mongoose = require('mongoose');
const Table = require('../Table');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongoose connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const generateRandomSeats = () => {
  const seatCounts = [4, 6, 8];
  const randomCount = seatCounts[Math.floor(Math.random() * seatCounts.length)];
  const seats = [];

  for (let i = 1; i <= randomCount; i++) {
    seats.push({
      seatNumber: i,
      isOccupied: false,
      isVIP: false,
    });
  }

  return seats;
};

const createTables = async () => {
  const tables = [];

  for (let i = 1; i <= 25; i++) {
    const isVIP = i <= 10;
    const tableNumber = `T${i}`;
    const seats = generateRandomSeats();

    const table = {
      tableNumber,
      seats,
      isAvailable: true,
      reservedAt: null,
      reservedBy: null,
      isVIP,
    };

    tables.push(table);
  }

  try {
    await Table.insertMany(tables);
    console.log('Tables seeded successfully');
  } catch (err) {
    console.error('Error seeding tables:', err);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await createTables();
};

seedDatabase();
