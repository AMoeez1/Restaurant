const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const path = require('path');

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if needed for cookies or auth headers
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use('/assets', express.static('assets'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));



// app.use(cors());

app.use("/", require("./routes/auth"));
app.use("/", require('./routes/home'));
app.use("/", require('./routes/cart'));
app.use("/", require('./routes/order'));
app.use("/admin", require('./routes/admin/auth-admin'));
app.use("/admin", require('./routes/admin/dashboard'));
app.use("/admin", require('./routes/admin/dish'));

mongoose
  .connect("mongodb://127.0.0.1:27017/Restaurant")
  .then(() => console.log("Mongoose connected successfully"))
  .catch((error) => console.log(error));

app.listen(6001, () => console.log("Server Started"));
