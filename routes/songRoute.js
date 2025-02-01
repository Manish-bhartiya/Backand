const express = require('express');
const { createSong, getAllSongs, getSongById } = require('../contorllers/songController');
const upload = require('../utils/multer'); // Multer middleware for file uploads
const router = express.Router();

// Song routes
router.post('/createsongs', upload, createSong);  // Ensure file upload before calling createSong
router.get('/songs', getAllSongs);
router.get('/songs/:id', getSongById);

module.exports = router;
