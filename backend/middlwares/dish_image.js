const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = 'assets';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const dishDir = path.join(dir, 'dish');
if (!fs.existsSync(dishDir)) {
  fs.mkdirSync(dishDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dishDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimes.includes(file.mimetype) &&
    ['.jpeg', '.jpg', '.png'].includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG files are allowed"), false);
  }
};

const dish_image = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = dish_image;
