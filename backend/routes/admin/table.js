const express = require('express')
const router = express.Router();

const Table = require('../../models/Table')

router.get('/tables', async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching tables.' });
  }
});

module.exports = router;